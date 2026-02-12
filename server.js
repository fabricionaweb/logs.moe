#!/usr/bin/env node
import http from "node:http";
import fs from "node:fs/promises";
import getRawBody from "raw-body";
import { encrypt } from "./static/subtle.mjs";
import { getGist, addGist } from "./src/database.js";
import { PORT, BIND, BASE_URL, LIMIT_SIZE } from "./src/constants.js";

// static files whitelist: url -> [file path, content type]
const staticFiles = {
  "/styles.css": ["./static/styles.css", "text/css"],
  "/home.mjs": ["./static/home.mjs", "application/javascript"],
  "/view.mjs": ["./static/view.mjs", "application/javascript"],
  "/subtle.mjs": ["./static/subtle.mjs", "application/javascript"],
};

// simple template engine
const render = async (template) => {
  const layout = await fs.readFile("./src/views/_layout.html", "utf8");
  const body = await fs.readFile(`./src/views/${template}.html`, "utf8");
  return layout.replace("{{body}}", body).replaceAll("{{BASE_URL}}", BASE_URL);
};

// route handlers
const home = async (_req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.end(await render("home"));
};

const view = async (_req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.end(await render("view"));
};

const gistData = async (_req, res, match) => {
  const gist = getGist(match.pathname.groups.uuid);
  if (!gist) throw { code: 404, message: "Not found" };

  res.setHeader("Cache-Control", "max-age=2592000");
  res.setHeader("X-IV", gist.iv);
  res.end(Buffer.from(gist.cipherText));
};

const createGist = async (req, res) => {
  const buffer = await getRawBody(req, { limit: LIMIT_SIZE });
  if (!buffer.length) throw { code: 406, message: "empty file" };

  const { iv, k, cipherText } = await encrypt(buffer);
  const uuid = addGist(iv, cipherText);

  res.statusCode = 201;
  res.end(`${BASE_URL}/${uuid}#${k}`);
};

// routes using URLPattern (the order is relevant)
const routes = [
  { method: "GET", pattern: new URLPattern({ pathname: "/" }), handler: home },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/data/:uuid" }),
    handler: gistData,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/:uuid" }),
    handler: view,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/" }),
    handler: createGist,
  },
];

// request handler
const handleRequest = async (req, res) => {
  // static files
  const [filepath, type] = staticFiles[req.url] || [];
  if (filepath) {
    const content = await fs.readFile(filepath);
    res.setHeader("Content-Type", type);
    res.setHeader("Cache-Control", "max-age=2592000");
    res.end(content);
    return;
  }

  // routes
  const match = routes.find(
    (route) => req.method === route.method && route.pattern.test(req.url),
  );
  if (match) {
    const route = match.pattern.exec(req.url);
    return await match.handler(req, res, route);
  }

  throw { code: 404, message: "Not found" };
};

// server
const server = http.createServer(async (req, res) => {
  try {
    await handleRequest(req, res);
  } catch (err) {
    res.statusCode = err.code || 500;
    res.end(err.message || "Server error");
  }
});

server.listen(PORT, BIND, () => {
  console.log(`Listen on http://${BIND}:${PORT}`);
});
