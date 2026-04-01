import { promises as fs } from "fs";
import path from "path";
import type { StudyLocation } from "./locations";

const customPath = path.join(process.cwd(), "data", "custom-locations.json");

function isStudyLocation(x: unknown): x is StudyLocation {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.name === "string" &&
    typeof o.building === "string" &&
    typeof o.floor === "string" &&
    typeof o.description === "string" &&
    Array.isArray(o.amenities) &&
    o.amenities.every((a) => typeof a === "string") &&
    typeof o.typicalCapacity === "number" &&
    typeof o.baselineNoise === "number" &&
    typeof o.baselineBusyness === "number"
  );
}

export async function readCustomLocations(): Promise<StudyLocation[]> {
  try {
    const raw = await fs.readFile(customPath, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStudyLocation);
  } catch {
    return [];
  }
}

export async function appendCustomLocation(loc: StudyLocation): Promise<void> {
  const list = await readCustomLocations();
  list.push(loc);
  await fs.writeFile(customPath, JSON.stringify(list, null, 2), "utf-8");
}

export function newCustomLocationId(): string {
  return `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
