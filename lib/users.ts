import { promises as fs } from "fs";
import path from "path";

const usersPath = path.join(process.cwd(), "data", "users.json");

export type UserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

async function readRaw(): Promise<UserRecord[]> {
  try {
    const raw = await fs.readFile(usersPath, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isUserRecord);
  } catch {
    return [];
  }
}

function isUserRecord(x: unknown): x is UserRecord {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.email === "string" &&
    typeof o.passwordHash === "string" &&
    typeof o.createdAt === "string"
  );
}

export async function findUserByEmail(email: string): Promise<UserRecord | undefined> {
  const normalized = email.trim().toLowerCase();
  const users = await readRaw();
  return users.find((u) => u.email === normalized);
}

export async function findUserById(id: string): Promise<UserRecord | undefined> {
  const users = await readRaw();
  return users.find((u) => u.id === id);
}

export async function createUser(
  email: string,
  passwordHash: string,
): Promise<UserRecord> {
  const users = await readRaw();
  const normalized = email.trim().toLowerCase();
  if (users.some((u) => u.email === normalized)) {
    throw new Error("EMAIL_IN_USE");
  }
  const record: UserRecord = {
    id: crypto.randomUUID(),
    email: normalized,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.push(record);
  await fs.writeFile(usersPath, JSON.stringify(users, null, 2), "utf-8");
  return record;
}
