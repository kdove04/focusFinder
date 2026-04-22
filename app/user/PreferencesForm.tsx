"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { UserStudyPreferences } from "@/lib/userPreferences";

type Props = {
  initial: UserStudyPreferences;
};

export function PreferencesForm({ initial }: Props) {
  const router = useRouter();
  const [preferredNoise, setPreferredNoise] = useState(initial.preferredNoise);
  const [preferredBusyness, setPreferredBusyness] = useState(initial.preferredBusyness);
  const [studyStyle, setStudyStyle] = useState(initial.studyStyle);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setErr(null);
    try {
      const res = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ preferredNoise, preferredBusyness, studyStyle }),
      });
      const data = (await res.json()) as { error?: string; preferences?: UserStudyPreferences };
      if (!res.ok) {
        setErr(data.error ?? "Could not save.");
        return;
      }
      setMessage("Preferences saved.");
      router.refresh();
    } catch {
      setErr("Network error. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-jsu-navy">Typical noise you want</label>
        <p className="mt-0.5 text-xs text-muted">We match this to each spot’s baseline noise.</p>
        <select
          value={preferredNoise}
          onChange={(e) =>
            setPreferredNoise(e.target.value as UserStudyPreferences["preferredNoise"])
          }
          className="mt-2 w-full max-w-sm rounded-xl border border-jsu-navy/15 bg-white px-3 py-2.5 text-sm text-jsu-navy outline-none ring-jsu-gold/50 focus:ring-2"
        >
          <option value="quiet">Quieter spaces</option>
          <option value="moderate">Some background (moderate)</option>
          <option value="loud">Busy / energetic</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-jsu-navy">How busy you like it</label>
        <select
          value={preferredBusyness}
          onChange={(e) =>
            setPreferredBusyness(e.target.value as UserStudyPreferences["preferredBusyness"])
          }
          className="mt-2 w-full max-w-sm rounded-xl border border-jsu-navy/15 bg-white px-3 py-2.5 text-sm text-jsu-navy outline-none ring-jsu-gold/50 focus:ring-2"
        >
          <option value="low">Less crowded</option>
          <option value="medium">Moderate traffic</option>
          <option value="high">High energy / lots of people</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-jsu-navy">How you usually study</label>
        <select
          value={studyStyle}
          onChange={(e) => setStudyStyle(e.target.value as UserStudyPreferences["studyStyle"])}
          className="mt-2 w-full max-w-sm rounded-xl border border-jsu-navy/15 bg-white px-3 py-2.5 text-sm text-jsu-navy outline-none ring-jsu-gold/50 focus:ring-2"
        >
          <option value="solo">Solo / focus</option>
          <option value="group">With a partner or small group</option>
          <option value="either">Either</option>
        </select>
      </div>
      {err && (
        <p className="text-sm text-rose-800" role="alert">
          {err}
        </p>
      )}
      {message && <p className="text-sm text-jsu-navy/80">{message}</p>}
      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-jsu-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-jsu-blue disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save preferences"}
      </button>
    </form>
  );
}
