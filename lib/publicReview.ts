import type { Review } from "./reviews";

/** Strip fields that should not be sent to the browser */
export function toPublicReview(r: Review): Omit<Review, "submittedByEmail"> {
  const { submittedByEmail, ...rest } = r;
  void submittedByEmail;
  return rest;
}
