import { NextResponse } from "next/server";
import { studyLocations } from "@/lib/locations";
import { computeLiveMetrics } from "@/lib/liveMetrics";
import { requireSession } from "@/lib/requireSession";

export const dynamic = "force-dynamic";

export async function GET() {
  const { response } = await requireSession();
  if (response) return response;

  const tick = Math.floor(Date.now() / 5000);
  const metrics = computeLiveMetrics(studyLocations, tick);
  return NextResponse.json({ metrics, tick });
}
