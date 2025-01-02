import { DatabaseSync } from "node:sqlite";
import { nanoid } from "nanoid";
import { DB_PATH } from "./constants.js";

const db = new DatabaseSync(DB_PATH || ":memory:");

db.exec(`
  CREATE TABLE IF NOT EXISTS gists (
    uuid TEXT PRIMARY KEY,
    iv TEXT NOT NULL,
    cipherText BLOB NOT NULL,
    createAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

/**
 * @param  {Uint8Array<ArrayBuffer>} iv
 * @param  {ArrayBuffer}             cipherText
 * @return {string}                  uuid
 */
export const createGist = (iv, cipherText) => {
  const uuid = nanoid(22);

  const query = db.prepare(
    "INSERT INTO gists (uuid, iv, cipherText) VALUES (?, ?, ?)"
  );
  query.run(uuid, iv.toString(), Buffer.from(cipherText));

  return uuid;
};

/**
 * @typedef  {Object}                PartialGist
 * @property {string}                iv
 * @property {ArrayBuffer}           cipherText
 *
 * @param    {string}                uuid
 * @return   {PartialGist|undefined} {iv, cipherText}
 */
export const getGist = (uuid) => {
  const query = db.prepare("SELECT cipherText, iv FROM gists WHERE uuid = ?");
  return query.get(uuid);
};
