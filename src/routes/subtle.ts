import { Middleware } from "oak";
import { transpile } from "emit";

// transpiles decrypt.ts to javascript to use in frontend
export const subtle: Middleware = async (ctx) => {
  const url = new URL("../utils/decrypt.ts", import.meta.url);
  const result = await transpile(url);

  ctx.response.type = "text/javascript";
  ctx.response.body = result.get(url.href);
};
