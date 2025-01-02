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
  await ctx.render("home", { BASE_URL });
});

router.get("/:uuid", async (ctx, next) => {
  if (ctx.get("x-requested-with") !== "XMLHttpRequest") {
    return await ctx.render("view");
  }

  const gist = getGist(ctx.params.uuid);
  if (!gist) {
    return next();
  }

  ctx.set("X-IV", gist.iv);
  ctx.body = Buffer.from(gist.cipherText);
});
