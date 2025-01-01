import Router from "@koa/router";

export const router = new Router();

router.post("/", (ctx, next) => {
  if (!ctx.request.rawBody) {
    ctx.throw("empty file", 406);
  }

  ctx.body = "created";
});

router.get("/", async (ctx, next) => {
  await ctx.render("home");
});

router.get("/:id", (ctx, next) => {
  ctx.body = ctx.params.id;
});
