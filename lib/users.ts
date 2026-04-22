import { createServiceRoleClient } from "./supabase/server";

export type UserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

type AppUserRow = {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
};

function rowToUser(r: AppUserRow): UserRecord {
  return {
    id: r.id,
    email: r.email,
    passwordHash: r.password_hash,
    createdAt: r.created_at,
  };
}

export async function findUserByEmail(email: string): Promise<UserRecord | undefined> {
  const normalized = email.trim().toLowerCase();
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("app_users")
    .select("id, email, password_hash, created_at")
    .eq("email", normalized)
    .maybeSingle();
  if (error) throw error;
  if (!data) return undefined;
  return rowToUser(data as AppUserRow);
}

export async function findUserById(id: string): Promise<UserRecord | undefined> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("app_users")
    .select("id, email, password_hash, created_at")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return undefined;
  return rowToUser(data as AppUserRow);
}

export async function createUser(email: string, passwordHash: string): Promise<UserRecord> {
  const supabase = createServiceRoleClient();
  const normalized = email.trim().toLowerCase();
  const id = crypto.randomUUID();
  const { data, error } = await supabase
    .from("app_users")
    .insert({
      id,
      email: normalized,
      password_hash: passwordHash,
      created_at: new Date().toISOString(),
    })
    .select("id, email, password_hash, created_at")
    .single();
  if (error) {
    if (error.code === "23505") {
      throw new Error("EMAIL_IN_USE");
    }
    throw error;
  }
  return rowToUser(data as AppUserRow);
}
