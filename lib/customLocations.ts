import { createServiceRoleClient } from "./supabase/server";
import type { StudyLocation } from "./locations";

type CustomLocationRow = {
  id: string;
  name: string;
  building: string;
  floor: string;
  description: string;
  amenities: string[] | null;
  typical_capacity: number;
  baseline_noise: number;
  baseline_busyness: number;
};

function rowToLocation(r: CustomLocationRow): StudyLocation {
  return {
    id: r.id,
    name: r.name,
    building: r.building,
    floor: r.floor,
    description: r.description,
    amenities: Array.isArray(r.amenities) ? r.amenities : [],
    typicalCapacity: r.typical_capacity,
    baselineNoise: r.baseline_noise,
    baselineBusyness: r.baseline_busyness,
  };
}

export async function readCustomLocations(): Promise<StudyLocation[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("custom_locations")
    .select(
      "id, name, building, floor, description, amenities, typical_capacity, baseline_noise, baseline_busyness",
    );
  if (error) throw error;
  if (!data?.length) return [];
  return (data as CustomLocationRow[]).map(rowToLocation);
}

export async function appendCustomLocation(loc: StudyLocation): Promise<void> {
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("custom_locations").insert({
    id: loc.id,
    name: loc.name,
    building: loc.building,
    floor: loc.floor,
    description: loc.description,
    amenities: loc.amenities,
    typical_capacity: loc.typicalCapacity,
    baseline_noise: loc.baselineNoise,
    baseline_busyness: loc.baselineBusyness,
  });
  if (error) throw error;
}

export function newCustomLocationId(): string {
  return `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
