"use client";

import { useEffect, useState } from "react";
import MealDisplay from "./MealDisplay";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Button from "@/components/ui/Button";

export default function TodayMealClient() {
  const [mealData, setMealData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationsRemaining, setGenerationsRemaining] = useState<number>(3);

  const fetchMeal = async () => {
    try {
      const response = await fetch("/api/meal/today");
      if (!response.ok) throw new Error("Failed to fetch meal");
      const data = await response.json();
      setMealData(data.meal);
      setGenerationsRemaining(data.generationsRemaining);
    } catch (err) {
      setError("Failed to load meal");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMeal();
  }, []);

  const handleRegenerate = async () => {
    if (generationsRemaining <= 0) {
      alert("You've reached your daily limit of 3 meal generations. Try again tomorrow!");
      return;
    }

    if (!confirm("Generate a new meal? This will replace your current meal.")) {
      return;
    }

    setIsRegenerating(true);
    try {
      const response = await fetch("/api/meal/regenerate", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to regenerate meal");
      }

      setMealData(data.meal);
      setGenerationsRemaining(data.generationsRemaining);
    } catch (err: any) {
      alert(err.message || "Failed to regenerate meal");
      console.error(err);
    } finally {
      setIsRegenerating(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-600">{error}</div>;
  if (!mealData) return <div className="text-center">No meal found</div>;

  return (
    <div className="space-y-6">
      {/* Regenerate Button */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Regenerations remaining today: <span className="font-bold text-primary">{generationsRemaining}/3</span>
        </div>
        <Button
          variant="outline"
          onClick={handleRegenerate}
          isLoading={isRegenerating}
          disabled={generationsRemaining <= 0}
        >
          {generationsRemaining > 0 ? "🔄 Generate New Meal" : "⏰ Limit Reached"}
        </Button>
      </div>

      <MealDisplay
        mealId={mealData.id}
        mealData={mealData.meal_data}
        confirmed={mealData.confirmed}
      />
    </div>
  );
}
