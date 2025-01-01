import { DatabaseSync } from "node:sqlite";
import { nanoid } from "nanoid";

const db = new DatabaseSync(":memory:");

db.exec(`
  CREATE TABLE IF NOT EXISTS gists (
    uuid TEXT PRIMARY KEY,
    iv TEXT NOT NULL,
    data BLOB NOT NULL,
    createAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export const createGist = (iv, data) => {
  const uuid = nanoid(22);

  const query = db.prepare(
    "INSERT INTO gists (uuid, iv, data) VALUES (?, ?, ?)"
  );
  query.run(uuid, iv.toString(), Buffer.from(data));

  return uuid;
};

export const getGists = () => {
  const query = db.prepare("SELECT * FROM gists");
  return query.all();
};
