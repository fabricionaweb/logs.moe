import Koa from "koa";
import serve from "koa-static";
import render from "@koa/ejs";
import { bodyParser } from "@koa/bodyparser";
import { router } from "./src/routes.js";
import { IS_PROD, BIND, PORT, LIMIT_SIZE } from "./src/constants.js";

const app = new Koa();

// static server
app.use(
  serve(IS_PROD ? "./static/dist" : "./static", {
    maxAge: 2592000 * 1000, // 30d in milliseconds
  })
);

// views
render(app, {
  root: "./src/views",
  layout: "_layout",
});

// parse form files
app.use(
  bodyParser({
    enableTypes: ["form", "text", "json", "xml"],
    formLimit: LIMIT_SIZE,
    textLimit: LIMIT_SIZE,
    jsonLimit: LIMIT_SIZE,
    xmlLimit: LIMIT_SIZE,
  })
);

// routes
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`Listen on http://${BIND}:${PORT}`);
});
