
// Define the interface for user reviews
export interface UserReview {
  id: string;
  user_id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  created_at: string;
  helpful_count: number;
}

// Define database insert type (omitting auto-generated fields)
export interface UserReviewInsert {
  user_id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
}
