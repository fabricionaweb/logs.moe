import * as log from "log";
import { load } from "dotenv";
import { Application } from "oak";
import * as middleware from "./src/middlewares/index.ts";
import * as cron from "./src/cron/index.ts";
import { router } from "./src/router.ts";

// take care of expired files
Deno.cron("Cleanup", "0 0 * * *", cron.cleanup);

await load({ export: true });
const port = Number(Deno.env.get("PORT"));
const app = new Application();

app.use(middleware.logs);
app.use(middleware.headers);
app.use(router.routes());
app.use(router.allowedMethods({ throw: true }));
app.use(middleware.assets);

app.addEventListener("listen", () => {
  log.info(`SERVER listening on port ${port}`);
});

await app.listen({ port });
