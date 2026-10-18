"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { FEEDBACK_TAGS, FeedbackTag } from "@/types/feedback";

interface FeedbackModalProps {
  mealId: string;
  onClose: () => void;
}

const TAG_LABELS: Record<FeedbackTag, string> = {
  too_hard: "Too Hard",
  too_long: "Too Long",
  missing_ingredients: "Missing Ingredients",
  will_make_again: "Will Make Again",
  too_spicy: "Too Spicy",
  too_bland: "Too Bland",
  portion_too_small: "Portion Too Small",
  portion_too_large: "Portion Too Large",
  expensive_ingredients: "Expensive Ingredients",
  loved_it: "Loved It",
};

export default function FeedbackModal({ mealId, onClose }: FeedbackModalProps) {
  const [didMake, setDidMake] = useState<boolean | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    if (didMake === null) {
      alert("Please indicate if you made the meal");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/meal/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meal_id: mealId,
          did_make: didMake,
          rating: rating > 0 ? rating : undefined,
          tags: selectedTags.length > 0 ? selectedTags : undefined,
          notes: notes.trim() || undefined,
        }),
      });

      if (response.ok) {
        alert("Thank you for your feedback!");
        onClose();
      } else {
        alert("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">How was your meal?</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* Did you make it? */}
            <div>
              <h3 className="font-semibold mb-3 text-gray-900">Did you make this meal?</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setDidMake(true)}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all font-semibold ${
                    didMake === true
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 hover:border-green-300 text-gray-700"
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setDidMake(false)}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all font-semibold ${
                    didMake === false
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 hover:border-red-300 text-gray-700"
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Rating (only if made) */}
            {didMake && (
              <div>
                <h3 className="font-semibold mb-3 text-gray-900">Rate this meal</h3>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="text-4xl transition-all hover:scale-110"
                    >
                      {star <= rating ? "⭐" : "☆"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Tags */}
            <div>
              <h3 className="font-semibold mb-3 text-gray-900">Quick feedback (optional)</h3>
              <div className="grid grid-cols-2 gap-3">
                {FEEDBACK_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      selectedTags.includes(tag)
                        ? "border-primary bg-primary text-white"
                        : "border-gray-200 hover:border-primary text-gray-700"
                    }`}
                  >
                    {TAG_LABELS[tag]}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <h3 className="font-semibold mb-3 text-gray-900">Additional notes (optional)</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share any additional thoughts..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400"
                rows={4}
              />
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                isLoading={isSubmitting}
                className="flex-1"
                disabled={didMake === null}
              >
                Submit Feedback
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
