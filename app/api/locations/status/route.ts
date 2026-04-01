import { NextResponse } from "next/server";
import { studyLocations } from "@/lib/locations";
import { computeLiveMetrics } from "@/lib/liveMetrics";

export const dynamic = "force-dynamic";

export async function GET() {
  const tick = Math.floor(Date.now() / 5000);
  const metrics = computeLiveMetrics(studyLocations, tick);
  return NextResponse.json({ metrics, tick });
}
