import * as log from "log";
import { Application } from "oak";
import * as middleware from "./src/middlewares/index.ts";
import * as cron from "./src/cron/index.ts";
import { router } from "./src/router.ts";
import { LISTEN_PORT } from "./src/constants.ts";

// take care of expired files
Deno.cron("Cleanup", "0 0 * * *", cron.cleanup);

const app = new Application();
const port = Number(LISTEN_PORT);

app.use(middleware.logs);
app.use(middleware.headers);
app.use(router.routes());
app.use(router.allowedMethods({ throw: true }));
app.use(middleware.assets);

app.addEventListener("listen", () => {
  log.info(`SERVER listening on port ${port}`);
});

await app.listen({ port });
