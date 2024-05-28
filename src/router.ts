import { Router } from "oak";
import * as middlewares from "./middlewares/index.ts";
import * as routes from "./routes/index.ts";

export const router = new Router();

// transpile utils/decrypt.ts to use on front-end
router.get("/libs/subtle.mjs", routes.subtle);

// returns the encrypted content as binary
router.get("/data/:uuid", routes.data);

// renders the file
router.get("/:uuid", routes.view);

// api to upload new file
router.post("/", middlewares.secure, routes.create);

// render home page
router.get("/", routes.home);
