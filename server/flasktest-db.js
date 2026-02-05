const Database = require("better-sqlite3");
const db = new Database("users.db");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
email TEXT UNIQUE NOT NULL,
name TEXT,
password_hash TEXT NOT NULL,
created_at TEXT NOT NULL
);
`);

module.exports = db;