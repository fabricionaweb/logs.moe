import { load } from "dotenv";
await load({ export: true });

export const LISTEN_PORT = `${Deno.env.get("PORT")}`; // port to server listen to
export const BASE_URL = `${Deno.env.get("BASE_URL")}`; // url to print after upload
export const DATA_DIR = `${Deno.env.get("DATA_DIR")}`; // directory to save .db file
export const FILES_DIR = `${DATA_DIR}/files`; // directory to upload binaries

export const ASSETS_DIR = `${Deno.cwd()}/assets`; // directory to static assets
export const VIEWS_DIR = `${Deno.cwd()}/src/views`; // directory contain .ejs templates

export const MAX_REQUEST_SIZE = 21 * 1024 * 1024; // in bytes (21mb)
export const FILE_TTL = 7 * 24 * 60 * 60 * 1000; // in milliseconds (7 days)
