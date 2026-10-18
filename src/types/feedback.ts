export interface Feedback {
  id: string;
  meal_id: string;
  did_make: number;
  rating?: number;
  tags?: string[];
  notes?: string;
  submitted_at: number;
}

export interface FeedbackSubmission {
  meal_id: string;
  did_make: boolean;
  rating?: number;
  tags?: string[];
  notes?: string;
}

export const FEEDBACK_TAGS = [
  'too_hard',
  'too_long',
  'missing_ingredients',
  'will_make_again',
  'too_spicy',
  'too_bland',
  'portion_too_small',
  'portion_too_large',
  'expensive_ingredients',
  'loved_it',
] as const;

export type FeedbackTag = typeof FEEDBACK_TAGS[number];
