import Koa from "koa";
import { BIND, PORT } from "./src/constants.js";

const app = new Koa();

app.listen(PORT, () => {
  console.log(`Listen on http://${BIND}:${PORT}`);
});
