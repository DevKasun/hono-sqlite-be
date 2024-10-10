import { Database } from "bun:sqlite";

let db: Database;

try {
  db = new Database("users.sqlite", { create: true });

  db.query(
    `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`,
  ).run();

  console.log(`Database connected and table created successfully! ✅`);
} catch (error) {
  console.log(`Database connection error: ${error} ❗️`);
  process.exit(1);
}

export default db;
