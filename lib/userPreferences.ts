import { createServiceRoleClient } from "./supabase/server";

export type UserStudyPreferences = {
  userId: string;
  preferredNoise: "quiet" | "moderate" | "loud";
  preferredBusyness: "low" | "medium" | "high";
  studyStyle: "solo" | "group" | "either";
  updatedAt: string;
};

type PrefsRow = {
  user_id: string;
  preferred_noise: string;
  preferred_busyness: string;
  study_style: string;
  updated_at: string;
};

function isNoise(s: string): s is UserStudyPreferences["preferredNoise"] {
  return s === "quiet" || s === "moderate" || s === "loud";
}

function isBusyness(s: string): s is UserStudyPreferences["preferredBusyness"] {
  return s === "low" || s === "medium" || s === "high";
}

function isStyle(s: string): s is UserStudyPreferences["studyStyle"] {
  return s === "solo" || s === "group" || s === "either";
}

function rowToPrefs(r: PrefsRow): UserStudyPreferences {
  return {
    userId: r.user_id,
    preferredNoise: isNoise(r.preferred_noise) ? r.preferred_noise : "quiet",
    preferredBusyness: isBusyness(r.preferred_busyness) ? r.preferred_busyness : "low",
    studyStyle: isStyle(r.study_style) ? r.study_style : "either",
    updatedAt: r.updated_at,
  };
}

export function defaultUserStudyPreferences(userId: string): UserStudyPreferences {
  return {
    userId,
    preferredNoise: "quiet",
    preferredBusyness: "low",
    studyStyle: "either",
    updatedAt: new Date().toISOString(),
  };
}

export async function getUserPreferences(
  userId: string,
): Promise<UserStudyPreferences | null> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("user_study_preferences")
    .select("user_id, preferred_noise, preferred_busyness, study_style, updated_at")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return rowToPrefs(data as PrefsRow);
}

export async function upsertUserPreferences(
  userId: string,
  input: {
    preferredNoise: UserStudyPreferences["preferredNoise"];
    preferredBusyness: UserStudyPreferences["preferredBusyness"];
    studyStyle: UserStudyPreferences["studyStyle"];
  },
): Promise<UserStudyPreferences> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("user_study_preferences")
    .upsert(
      {
        user_id: userId,
        preferred_noise: input.preferredNoise,
        preferred_busyness: input.preferredBusyness,
        study_style: input.studyStyle,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    )
    .select("user_id, preferred_noise, preferred_busyness, study_style, updated_at")
    .single();
  if (error) throw error;
  return rowToPrefs(data as PrefsRow);
}
