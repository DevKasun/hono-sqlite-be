import { Hono } from "hono";
import db from "./database/db";
import { UserType } from "./types/types";
const app = new Hono();

if (!db) {
  console.log("Db not found!");
  process.exit(1);
}

const getUser = db!.prepare("SELECT * FROM users where email = ?");

const getAllUsers = db!.prepare("SELECT id, email FROM users");

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/register", async (c) => {
  const { email, password } = await c.req.json();
  const hashedPassword = await Bun.password.hash(password);

  try {
    db.query("INSERT INTO users (email, password) VALUES (?, ?)").run(
      email,
      hashedPassword,
    );
    return c.json({ message: "User registered successfully" }, 201);
  } catch (error) {
    return c.json({ error: "Username already exists" + error }, 400);
  }
});

app.post("/login", async (c) => {
  const { email, password } = await c.req.json();

  try {
    const user = db.query(`SELECT * FROM users`).get(email) as
      | UserType
      | undefined;
    if (!user) {
      return c.json({ messsage: "Invalid credentials" }, 401);
    }
    const isPasswordVerified = await Bun.password.verify(
      password,
      user.password,
    );
    if (isPasswordVerified) {
      return c.json({ messsage: "Login successfully!", userID: user.id }, 200);
    } else {
      return c.json({ message: "Invalid credentials" }, 401);
    }
  } catch (e) {
    console.log(`Error: ${e}`);
    return c.json({ error: "An unexpected error occurred" }, 500);
  }
});

app.get("/users", (c) => {
  try {
    const users = getAllUsers.all() as UserType[];
    if (users.length === 0) {
      return c.json({ message: "users not found" }, 404);
    }
    return c.json({ users }, 200);
  } catch (e) {
    console.error(`Error: ${e}`);
    return c.json({ error: "An unexpected error occurred ❗️" }, 500);
  }
});

export default app;
