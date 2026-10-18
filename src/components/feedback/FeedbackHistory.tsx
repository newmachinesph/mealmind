"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface FeedbackItem {
  id: string;
  meal_id: string;
  did_make: boolean;
  rating: number;
  tags: string[];
  notes: string | null;
  submitted_at: number;
  meal_date: string;
  meal_data: {
    meal_name: string;
    description: string;
    image_url?: string;
  };
}

export default function FeedbackHistory() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeedbackHistory();
  }, []);

  const fetchFeedbackHistory = async () => {
    try {
      const response = await fetch("/api/feedback/history");
      if (!response.ok) throw new Error("Failed to fetch feedback history");
      const data = await response.json();
      setFeedback(data.feedback);
    } catch (err) {
      setError("Failed to load feedback history");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  if (feedback.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No feedback yet</p>
        <p className="text-gray-500 mt-2">
          Start giving feedback on your meals to see your history here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Feedback History</h1>
        <p className="text-gray-600 mt-2">
          {feedback.length} meal{feedback.length !== 1 ? "s" : ""} reviewed
        </p>
      </div>

      <div className="grid gap-6">
        {feedback.map((item) => (
          <Card key={item.id}>
            <div className="flex gap-6">
              {/* Meal Image */}
              {item.meal_data.image_url && (
                <div className="flex-shrink-0">
                  {item.meal_data.image_url.startsWith("data:") ? (
                    <img
                      src={item.meal_data.image_url}
                      alt={item.meal_data.meal_name}
                      className="w-32 h-32 rounded-lg object-cover"
                    />
                  ) : (
                    <img
                      src={item.meal_data.image_url}
                      alt={item.meal_data.meal_name}
                      className="w-32 h-32 rounded-lg object-cover"
                    />
                  )}
                </div>
              )}

              {/* Feedback Details */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {item.meal_data.meal_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Meal from {item.meal_date} • Reviewed on {formatDate(item.submitted_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl mb-1">{renderStars(item.rating)}</div>
                    <div className="text-sm text-gray-600">{item.rating}/5</div>
                  </div>
                </div>

                {/* Did Make Badge */}
                <div className="mb-3">
                  {item.did_make ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      ✓ Made this meal
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      ✗ Didn't make this meal
                    </span>
                  )}
                </div>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {tag.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                )}

                {/* Notes */}
                {item.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">Your notes:</p>
                    <p className="text-gray-900">{item.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
