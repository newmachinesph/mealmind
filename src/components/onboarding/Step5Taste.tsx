"use client";

import { OnboardingData } from "@/types/user";

interface StepProps {
  formData: Partial<OnboardingData>;
  updateFormData: (data: Partial<OnboardingData>) => void;
}

const CUISINES = [
  "Italian",
  "Mexican",
  "Chinese",
  "Japanese",
  "Thai",
  "Indian",
  "Mediterranean",
  "French",
  "American",
  "Korean",
  "Vietnamese",
  "Middle Eastern",
];

const FLAVOR_PROFILES = [
  "Spicy",
  "Savory",
  "Sweet",
  "Tangy",
  "Umami",
  "Fresh",
  "Hearty",
  "Light",
];

const COMMON_INGREDIENTS = [
  "Chicken",
  "Beef",
  "Pork",
  "Fish",
  "Tofu",
  "Beans",
  "Rice",
  "Pasta",
  "Potatoes",
  "Mushrooms",
  "Avocado",
  "Tomatoes",
];

export default function Step5Taste({ formData, updateFormData }: StepProps) {
  const toggleCuisineLike = (cuisine: string) => {
    const current = formData.cuisine_likes || [];
    if (current.includes(cuisine)) {
      updateFormData({
        cuisine_likes: current.filter((item) => item !== cuisine),
      });
    } else {
      updateFormData({
        cuisine_likes: [...current, cuisine],
      });
    }
  };

  const toggleCuisineDislike = (cuisine: string) => {
    const current = formData.cuisine_dislikes || [];
    if (current.includes(cuisine)) {
      updateFormData({
        cuisine_dislikes: current.filter((item) => item !== cuisine),
      });
    } else {
      updateFormData({
        cuisine_dislikes: [...current, cuisine],
      });
    }
  };

  const toggleFlavorProfile = (flavor: string) => {
    const current = formData.flavor_profiles || [];
    if (current.includes(flavor)) {
      updateFormData({
        flavor_profiles: current.filter((item) => item !== flavor),
      });
    } else {
      updateFormData({
        flavor_profiles: [...current, flavor],
      });
    }
  };

  const toggleIngredientLike = (ingredient: string) => {
    const current = formData.ingredient_likes || [];
    if (current.includes(ingredient)) {
      updateFormData({
        ingredient_likes: current.filter((item) => item !== ingredient),
      });
    } else {
      updateFormData({
        ingredient_likes: [...current, ingredient],
      });
    }
  };

  const toggleIngredientDislike = (ingredient: string) => {
    const current = formData.ingredient_dislikes || [];
    if (current.includes(ingredient)) {
      updateFormData({
        ingredient_dislikes: current.filter((item) => item !== ingredient),
      });
    } else {
      updateFormData({
        ingredient_dislikes: [...current, ingredient],
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Favorite Cuisines
        </h2>
        <p className="text-gray-600 mb-4">Select cuisines you love</p>
        <div className="grid grid-cols-2 gap-3">
          {CUISINES.map((cuisine) => (
            <button
              key={cuisine}
              type="button"
              onClick={() => toggleCuisineLike(cuisine)}
              className={`p-3 rounded-lg border-2 transition-all ${
                formData.cuisine_likes?.includes(cuisine)
                  ? "border-green-500 bg-green-500 text-white"
                  : "border-gray-200 hover:border-green-300 text-gray-900"
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Cuisines to Avoid
        </h2>
        <p className="text-gray-600 mb-4">Select cuisines you don't enjoy</p>
        <div className="grid grid-cols-2 gap-3">
          {CUISINES.map((cuisine) => (
            <button
              key={cuisine}
              type="button"
              onClick={() => toggleCuisineDislike(cuisine)}
              className={`p-3 rounded-lg border-2 transition-all ${
                formData.cuisine_dislikes?.includes(cuisine)
                  ? "border-red-500 bg-red-500 text-white"
                  : "border-gray-200 hover:border-red-300 text-gray-900"
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Flavor Preferences
        </h2>
        <p className="text-gray-600 mb-4">What flavors do you enjoy?</p>
        <div className="grid grid-cols-2 gap-3">
          {FLAVOR_PROFILES.map((flavor) => (
            <button
              key={flavor}
              type="button"
              onClick={() => toggleFlavorProfile(flavor)}
              className={`p-3 rounded-lg border-2 transition-all ${
                formData.flavor_profiles?.includes(flavor)
                  ? "border-primary bg-primary text-white"
                  : "border-gray-200 hover:border-primary text-gray-900"
              }`}
            >
              {flavor}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Favorite Ingredients
        </h2>
        <p className="text-gray-600 mb-4">Ingredients you love to eat</p>
        <div className="grid grid-cols-2 gap-3">
          {COMMON_INGREDIENTS.map((ingredient) => (
            <button
              key={ingredient}
              type="button"
              onClick={() => toggleIngredientLike(ingredient)}
              className={`p-3 rounded-lg border-2 transition-all ${
                formData.ingredient_likes?.includes(ingredient)
                  ? "border-green-500 bg-green-500 text-white"
                  : "border-gray-200 hover:border-green-300 text-gray-900"
              }`}
            >
              {ingredient}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Ingredients to Avoid
        </h2>
        <p className="text-gray-600 mb-4">Ingredients you dislike</p>
        <div className="grid grid-cols-2 gap-3">
          {COMMON_INGREDIENTS.map((ingredient) => (
            <button
              key={ingredient}
              type="button"
              onClick={() => toggleIngredientDislike(ingredient)}
              className={`p-3 rounded-lg border-2 transition-all ${
                formData.ingredient_dislikes?.includes(ingredient)
                  ? "border-red-500 bg-red-500 text-white"
                  : "border-gray-200 hover:border-red-300 text-gray-900"
              }`}
            >
              {ingredient}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
