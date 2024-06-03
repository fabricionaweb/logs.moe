import express from "express"
import { FILES_DIR } from "../constants.js"
import { home } from "./home.js"
import { view } from "./view.js"

const router = express.Router()

router.get("/:uuid", view)
router.get("/", home)
router.use("/data", express.static(FILES_DIR))

export default router
