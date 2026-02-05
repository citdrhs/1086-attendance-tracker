const path = require("path");
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const db = require("./flasktest-db");

const app = express();

// parse JSON bodies
app.use(express.json());

// sessions (for demo: memory store; for production use a real store)
app.use(session({
secret: "change-this-secret",
resave: false,
saveUninitialized: false,
cookie: { httpOnly: true }
}));

// serve your frontend files
app.use(express.static(path.join(__dirname, "..", "public")));

// --- API ROUTES ---

app.post("/api/signup", async (req, res) => {
const { email, password, name } = req.body;

if (!email || !password) return res.status(400).json({ error: "Email and password required." });
if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters." });

const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
if (existing) return res.status(409).json({ error: "That email is already registered." });

const password_hash = await bcrypt.hash(password, 12);
const created_at = new Date().toISOString();

const info = db.prepare(
"INSERT INTO users (email, name, password_hash, created_at) VALUES (?, ?, ?, ?)"
).run(email, name || null, password_hash, created_at);

// log them in immediately
req.session.userId = info.lastInsertRowid;
res.json({ ok: true });
});

app.post("/api/login", async (req, res) => {
const { email, password } = req.body;
if (!email || !password) return res.status(400).json({ error: "Email and password required." });

const user = db.prepare("SELECT id, password_hash FROM users WHERE email = ?").get(email);
if (!user) return res.status(401).json({ error: "Invalid email or password." });

const ok = await bcrypt.compare(password, user.password_hash);
if (!ok) return res.status(401).json({ error: "Invalid email or password." });

req.session.userId = user.id;
res.json({ ok: true });
});

app.post("/api/logout", (req, res) => {
req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/me", (req, res) => {
if (!req.session.userId) return res.status(401).json({ error: "Not logged in." });
const user = db.prepare("SELECT id, email, name, created_at FROM users WHERE id = ?").get(req.session.userId);
res.json({ user });
});

// start
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
