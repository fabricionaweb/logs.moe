import Router from "@koa/router";
import { create } from "./create.js";
import { getGists } from "./database.js";

export const router = new Router();

router.post("/", async (ctx, next) => {
  if (!ctx.request.rawBody) {
    return ctx.throw(406, "empty file");
  }

  const buffer = Buffer.from(ctx.request.rawBody, "binary");
  const url = await create(buffer);

  ctx.status = 201;
  ctx.body = `${url}\n`;
});

router.get("/", async (ctx, next) => {
  const gists = getGists();
  console.log(gists);
  await ctx.render("home");
});

router.get("/:id", (ctx, next) => {
  ctx.body = ctx.params.id;
});
