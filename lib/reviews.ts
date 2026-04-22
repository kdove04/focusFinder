import { createServiceRoleClient } from "./supabase/server";

export type Review = {
  id: string;
  locationId: string;
  rating: number;
  noiseReported: "quiet" | "moderate" | "loud";
  comment: string;
  createdAt: string;
  /** Set server-side from session; omitted from API responses */
  submittedByEmail?: string;
};

type ReviewRow = {
  id: string;
  location_id: string;
  rating: number;
  noise_reported: string;
  comment: string;
  created_at: string;
  submitted_by_email: string | null;
};

function toNoise(
  s: string,
): "quiet" | "moderate" | "loud" {
  if (s === "quiet" || s === "moderate" || s === "loud") return s;
  return "moderate";
}

function rowToReview(r: ReviewRow): Review {
  return {
    id: r.id,
    locationId: r.location_id,
    rating: r.rating,
    noiseReported: toNoise(r.noise_reported),
    comment: r.comment,
    createdAt: r.created_at,
    submittedByEmail: r.submitted_by_email ?? undefined,
  };
}

export async function readReviews(): Promise<Review[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("id, location_id, rating, noise_reported, comment, created_at, submitted_by_email")
    .order("created_at", { ascending: false });
  if (error) throw error;
  if (!data?.length) return [];
  return (data as ReviewRow[]).map(rowToReview);
}

export async function appendReview(
  review: Omit<Review, "id" | "createdAt">,
): Promise<Review> {
  const supabase = createServiceRoleClient();
  const id = `rv_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const createdAt = new Date().toISOString();
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      id,
      location_id: review.locationId,
      rating: review.rating,
      noise_reported: review.noiseReported,
      comment: review.comment,
      created_at: createdAt,
      submitted_by_email: review.submittedByEmail ?? null,
    })
    .select("id, location_id, rating, noise_reported, comment, created_at, submitted_by_email")
    .single();
  if (error) throw error;
  return rowToReview(data as ReviewRow);
}
