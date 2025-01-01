import { DatabaseSync } from "node:sqlite";
import { nanoid } from "nanoid";
import { DB_PATH } from "./constants.js";

const db = new DatabaseSync(DB_PATH ? DB_PATH : ":memory:");

db.exec(`
  CREATE TABLE IF NOT EXISTS gists (
    uuid TEXT PRIMARY KEY,
    iv TEXT NOT NULL,
    cipherText BLOB NOT NULL,
    createAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export const createGist = (iv, cipherText) => {
  const uuid = nanoid(22);

  const query = db.prepare(
    "INSERT INTO gists (uuid, iv, cipherText) VALUES (?, ?, ?)"
  );
  query.run(uuid, iv.toString(), Buffer.from(cipherText));

  return uuid;
};

export const getGist = (uuid) => {
  const query = db.prepare("SELECT cipherText, iv FROM gists WHERE uuid = ?");
  return query.get(uuid);
};
