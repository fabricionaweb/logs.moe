import { Router } from "oak";
import * as middlewares from "./middlewares/index.ts";
import * as routes from "./routes/index.ts";

export const router = new Router();

// returns the encrypted content as binary
router.get("/data/:uuid", routes.data);

// renders the file
router.get("/:uuid", routes.view);

// api to upload new file
router.post("/", middlewares.secure, routes.create);

// render home page
router.get("/", routes.home);
