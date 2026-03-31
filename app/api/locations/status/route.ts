import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { studyLocations } from "@/lib/locations";
import { computeLiveMetrics } from "@/lib/liveMetrics";

export const dynamic = "force-dynamic";

export const GET = auth(async function GET(req) {
  if (!req.auth?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tick = Math.floor(Date.now() / 5000);
  const metrics = computeLiveMetrics(studyLocations, tick);
  return NextResponse.json({ metrics, tick });
});
