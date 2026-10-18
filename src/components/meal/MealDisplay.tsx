"use client";

import { useState } from "react";
import Image from "next/image";
import { MealData } from "@/types/meal";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import FeedbackModal from "./FeedbackModal";

interface MealDisplayProps {
  mealId: string;
  mealData: MealData;
  confirmed: boolean;
}

export default function MealDisplay({
  mealId,
  mealData,
  confirmed: initialConfirmed,
}: MealDisplayProps) {
  const [confirmed, setConfirmed] = useState(initialConfirmed);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      const response = await fetch("/api/meal/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meal_id: mealId }),
      });

      if (response.ok) {
        setConfirmed(true);
      }
    } catch (error) {
      console.error("Failed to confirm meal:", error);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Hero Image */}
        <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-2xl">
          {mealData.image_url ? (
            mealData.image_url.startsWith('data:') ? (
              // Use regular img tag for base64 data URLs
              <img
                src={mealData.image_url}
                alt={mealData.meal_name}
                className="w-full h-full object-cover"
              />
            ) : (
              // Use Next.js Image for remote URLs
              <Image
                src={mealData.image_url}
                alt={mealData.meal_name}
                fill
                className="object-cover"
                priority
              />
            )
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-700 flex flex-col items-center justify-center">
              <span className="text-white text-8xl mb-4">🍽️</span>
              <p className="text-white text-xl font-medium">{mealData.meal_name}</p>
            </div>
          )}
        </div>

        {/* Meal Title */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            {mealData.meal_name}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {mealData.description}
          </p>
        </div>

        {/* Quick Stats */}
        <Card>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {mealData.total_time}'
              </div>
              <div className="text-sm text-gray-600">Total Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {mealData.calories}
              </div>
              <div className="text-sm text-gray-600">Calories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {mealData.difficulty}
              </div>
              <div className="text-sm text-gray-600">Difficulty</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {mealData.servings}
              </div>
              <div className="text-sm text-gray-600">Servings</div>
            </div>
          </div>
        </Card>

        {/* Macros */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Nutrition per Serving</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {mealData.macros.protein}g
              </div>
              <div className="text-sm text-gray-600">Protein</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {mealData.macros.carbs}g
              </div>
              <div className="text-sm text-gray-600">Carbs</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {mealData.macros.fat}g
              </div>
              <div className="text-sm text-gray-600">Fat</div>
            </div>
          </div>
        </Card>

        {/* Ingredients */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ingredients</h2>
          <ul className="space-y-2">
            {mealData.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-gray-900">
                  <strong>{ingredient.quantity}</strong> {ingredient.item}
                  {ingredient.notes && (
                    <span className="text-gray-600 text-sm ml-1">
                      ({ingredient.notes})
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Instructions */}
        <Card>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Instructions</h2>
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="px-4 py-2 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors font-medium"
            >
              {showInstructions ? "Hide ▲" : "Show ▼"}
            </button>
          </div>
          {showInstructions && (
            <div className="mt-4">
            <ol className="space-y-4">
              {mealData.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="flex-1 pt-1 text-gray-900">{instruction}</p>
                </li>
              ))}
            </ol>
            </div>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {!confirmed ? (
            <Button
              onClick={handleConfirm}
              isLoading={isConfirming}
              className="flex-1"
            >
              I'll Make This
            </Button>
          ) : (
            <div className="flex-1 p-4 bg-green-50 border-2 border-green-500 rounded-lg text-center">
              <span className="text-green-700 font-medium">
                ✓ Confirmed! Enjoy your meal
              </span>
            </div>
          )}
          <Button
            variant="outline"
            onClick={() => setShowFeedback(true)}
            className="flex-1"
          >
            Give Feedback
          </Button>
        </div>
      </div>

      {showFeedback && (
        <FeedbackModal
          mealId={mealId}
          onClose={() => setShowFeedback(false)}
        />
      )}
    </>
  );
}
