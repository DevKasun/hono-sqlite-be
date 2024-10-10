import { Hono } from "hono";
import db from "./database/db";
import { UserType } from "./types/types";

const app = new Hono();

const insertUser = db!.prepare(
  "INSERT INTO users (email, password) VALUES (?,?)",
);

const getUser = db!.prepare("SELECT * FROM users where email = ?");

const getAllUsers = db!.prepare("SELECT id, email FROM users");

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/register", async (c) => {
  const { email, password } = await c.req.json();

  try {
    insertUser.run(email, password);

    return c.json({ message: "User created successfully 😍" }, 201);
  } catch (e) {
    if (e instanceof Error) {
      return c.json({ error: e.message }, 400);
    }
    return c.json({ error: "An unexpected error occurred ❗️" }, 500);
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
