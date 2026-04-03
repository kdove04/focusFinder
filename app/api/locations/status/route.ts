import { NextResponse } from "next/server";
import { getAllStudyLocations } from "@/lib/allLocations";
import { computeLiveMetrics } from "@/lib/liveMetrics";

export const dynamic = "force-dynamic";

export async function GET() {
  const locations = await getAllStudyLocations();
  const tick = Math.floor(Date.now() / 5000);
  const metrics = computeLiveMetrics(locations, tick);
  return NextResponse.json({ metrics, tick });
}
