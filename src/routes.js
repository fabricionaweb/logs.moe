import Router from "@koa/router";
import { create } from "./create.js";
import { getGist } from "./database.js";
import { BASE_URL } from "./constants.js";

export const router = new Router();

router.post("/", async (ctx) => {
  if (!ctx.request.rawBody) {
    return ctx.throw(406, "empty file");
  }

  const buffer = Buffer.from(ctx.request.rawBody, "binary");
  const { uuid, k } = await create(buffer);

  ctx.status = 201;
  ctx.body = `${BASE_URL}/${uuid}#${k}`;
});

router.get("/", async (ctx) => {
  await ctx.render("home");
});

router.get("/:uuid{.:ext}", async (ctx, next) => {
  const gist = getGist(ctx.params.uuid);

  if (!gist) {
    return next();
  }

  if (ctx.params.ext !== "bin") {
    return await ctx.render("view", gist);
  }

  ctx.set("X-IV", gist.iv);
  ctx.body = Buffer.from(gist.cipherText);
});
