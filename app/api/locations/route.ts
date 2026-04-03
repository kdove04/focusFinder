import { NextResponse } from "next/server";
import { appendCustomLocation, newCustomLocationId } from "@/lib/customLocations";
import { getAllStudyLocations } from "@/lib/allLocations";
import type { StudyLocation } from "@/lib/locations";

export const dynamic = "force-dynamic";

export async function GET() {
  const locations = await getAllStudyLocations();
  return NextResponse.json({ locations });
}

function parseAmenities(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input.filter((x): x is string => typeof x === "string").map((s) => s.trim()).filter(Boolean);
  }
  if (typeof input === "string") {
    return input
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      building?: string;
      floor?: string;
      description?: string;
      amenities?: unknown;
    };

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const building = typeof body.building === "string" ? body.building.trim() : "";
    if (!name || !building) {
      return NextResponse.json(
        { error: "Name and building are required." },
        { status: 400 },
      );
    }
    if (name.length > 120 || building.length > 120) {
      return NextResponse.json({ error: "Name or building is too long." }, { status: 400 });
    }

    const floor =
      typeof body.floor === "string" && body.floor.trim() ? body.floor.trim().slice(0, 40) : "1";
    const description =
      typeof body.description === "string"
        ? body.description.trim().slice(0, 500)
        : "Added by a student via Focus Finder.";
    const amenities = parseAmenities(body.amenities);
    if (amenities.length === 0) amenities.push("Wi‑Fi");

    const location: StudyLocation = {
      id: newCustomLocationId(),
      name,
      building,
      floor,
      description,
      amenities: amenities.slice(0, 12),
      typicalCapacity: 40,
      baselineNoise: 45,
      baselineBusyness: 55,
    };

    await appendCustomLocation(location);
    return NextResponse.json({ location });
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
}
