import express from "express"
import logger from "morgan"
import routes from "./src/routes/index.js"
import { notFound, errorHandler } from "./src/middlewares/index.js"

const app = express()
const port = process.env.PORT
const isProd = process.env.NODE_ENV?.startsWith("prod")

app.set("view engine", "ejs")
app.set("views", "./src/views")

app.use(logger(":method :url :status :response-time ms"))
app.use("/", routes)
app.use("/", express.static(isProd ? "./assets/dist" : "./assets"))
app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`SERVER listening on port ${port}`)
})
