#!/usr/bin/env node
import Koa from "koa";
import serve from "koa-static";
import render from "@koa/ejs";
import { router } from "./src/routes.js";
import { BIND, PORT } from "./src/constants.js";

const app = new Koa();
const { dirname } = import.meta;

// static server
app.use(
  serve(`${dirname}/static`, {
    maxAge: 2592000 * 1000, // 30d in milliseconds
  }),
);

// views
render(app, {
  root: `${dirname}/src/views`,
  layout: "_layout",
});

// routes
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`Listen on http://${BIND}:${PORT}`);
});
