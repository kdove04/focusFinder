import { NextResponse } from "next/server";
import { toPublicReview } from "@/lib/publicReview";
import { appendReview, readReviews } from "@/lib/reviews";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locationId = searchParams.get("locationId");
  let list = await readReviews();
  if (locationId) {
    list = list.filter((r) => r.locationId === locationId);
  }
  return NextResponse.json({ reviews: list.map(toPublicReview) });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
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
    const review = await appendReview({
      locationId,
      rating,
      noiseReported: noise,
      comment: typeof comment === "string" ? comment.slice(0, 2000) : "",
    });
    return NextResponse.json({ review: toPublicReview(review) });
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}
