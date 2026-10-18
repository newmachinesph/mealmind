"use client";

import { OnboardingData } from "@/types/user";

interface StepProps {
  formData: Partial<OnboardingData>;
  updateFormData: (data: Partial<OnboardingData>) => void;
}

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Pescatarian",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Paleo",
  "Low-Carb",
  "Halal",
  "Kosher",
];

const COMMON_ALLERGIES = [
  "Peanuts",
  "Tree Nuts",
  "Shellfish",
  "Fish",
  "Eggs",
  "Milk",
  "Soy",
  "Wheat",
  "Sesame",
];

export default function Step2Dietary({ formData, updateFormData }: StepProps) {
  const toggleDietaryRestriction = (option: string) => {
    const current = formData.dietary_restrictions || [];
    if (current.includes(option)) {
      updateFormData({
        dietary_restrictions: current.filter((item) => item !== option),
      });
    } else {
      updateFormData({
        dietary_restrictions: [...current, option],
      });
    }
  };

  const toggleAllergy = (allergy: string) => {
    const current = formData.allergies || [];
    if (current.includes(allergy)) {
      updateFormData({
        allergies: current.filter((item) => item !== allergy),
      });
    } else {
      updateFormData({
        allergies: [...current, allergy],
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Dietary Preferences
        </h2>
        <p className="text-gray-600 mb-4">
          Select any dietary restrictions you follow
        </p>
        <div className="grid grid-cols-2 gap-3">
          {DIETARY_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggleDietaryRestriction(option)}
              className={`p-3 rounded-lg border-2 transition-all ${
                formData.dietary_restrictions?.includes(option)
                  ? "border-primary bg-primary text-white"
                  : "border-gray-200 hover:border-primary text-gray-900"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Allergies</h2>
        <p className="text-gray-600 mb-4">
          Select any food allergies you have
        </p>
        <div className="grid grid-cols-2 gap-3">
          {COMMON_ALLERGIES.map((allergy) => (
            <button
              key={allergy}
              type="button"
              onClick={() => toggleAllergy(allergy)}
              className={`p-3 rounded-lg border-2 transition-all ${
                formData.allergies?.includes(allergy)
                  ? "border-red-500 bg-red-500 text-white"
                  : "border-gray-200 hover:border-red-300 text-gray-900"
              }`}
            >
              {allergy}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
