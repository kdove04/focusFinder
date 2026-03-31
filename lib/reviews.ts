import { promises as fs } from "fs";
import path from "path";

export type Review = {
  id: string;
  locationId: string;
  rating: number;
  noiseReported: "quiet" | "moderate" | "loud";
  comment: string;
  createdAt: string;
};

const reviewsPath = path.join(process.cwd(), "data", "reviews.json");

export async function readReviews(): Promise<Review[]> {
  try {
    const raw = await fs.readFile(reviewsPath, "utf-8");
    const parsed = JSON.parse(raw) as Review[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function appendReview(review: Omit<Review, "id" | "createdAt">): Promise<Review> {
  const reviews = await readReviews();
  const full: Review = {
    ...review,
    id: `rv_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  reviews.unshift(full);
  await fs.writeFile(reviewsPath, JSON.stringify(reviews, null, 2), "utf-8");
  return full;
}
