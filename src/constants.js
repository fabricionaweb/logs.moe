import path from "node:path"

const cwd = process.cwd()
const isProd = process.env.NODE_ENV?.startsWith("prod")

export const BASE_URL = process.env.BASE_URL // url to print after upload

export const VIEWS_DIR = path.resolve(cwd, "src/views") // views ejs
export const ASSETS_DIR = path.resolve(cwd, isProd ? "assets/dist" : "assets") // static assets

export const DATA_DIR = path.resolve(cwd, process.env.DATA_DIR) // directory to save .db file
export const FILES_DIR = path.resolve(DATA_DIR, "files") // directory to upload (and serve) binaries
