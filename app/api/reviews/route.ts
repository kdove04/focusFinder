import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { toPublicReview } from "@/lib/publicReview";
import { appendReview, readReviews } from "@/lib/reviews";

export const GET = auth(async function GET(req) {
  if (!req.auth?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const locationId = searchParams.get("locationId");
  let list = await readReviews();
  if (locationId) {
    list = list.filter((r) => r.locationId === locationId);
  }
  return NextResponse.json({ reviews: list.map(toPublicReview) });
});

export const POST = auth(async function POST(req) {
  if (!req.auth?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      locationId?: string;
      rating?: number;
      noiseReported?: string;
      comment?: string;
    };
    const { locationId, rating, noiseReported, comment } = body;
    if (!locationId || typeof rating !== "number") {
      return NextResponse.json(
        { error: "locationId and rating are required" },
        { status: 400 },
      );
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "rating must be 1–5" }, { status: 400 });
    }
    const noise =
      noiseReported === "quiet" || noiseReported === "moderate" || noiseReported === "loud"
        ? noiseReported
        : "moderate";
    const email =
      typeof req.auth.user.email === "string" ? req.auth.user.email : undefined;
    const review = await appendReview({
      locationId,
      rating,
      noiseReported: noise,
      comment: typeof comment === "string" ? comment.slice(0, 2000) : "",
      ...(email ? { submittedByEmail: email } : {}),
    });
    return NextResponse.json({ review: toPublicReview(review) });
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
});
