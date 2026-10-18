"use client";

import Input from "@/components/ui/Input";
import { OnboardingData } from "@/types/user";

interface StepProps {
  formData: Partial<OnboardingData>;
  updateFormData: (data: Partial<OnboardingData>) => void;
}

const HEALTH_GOALS = [
  "Weight Loss",
  "Muscle Gain",
  "Maintain Weight",
  "Improve Energy",
  "Better Digestion",
  "Heart Health",
  "Balanced Nutrition",
];

const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "Sedentary (little or no exercise)" },
  { value: "light", label: "Lightly Active (1-3 days/week)" },
  { value: "moderate", label: "Moderately Active (3-5 days/week)" },
  { value: "very", label: "Very Active (6-7 days/week)" },
  { value: "extra", label: "Extra Active (physical job + exercise)" },
];

export default function Step3Goals({ formData, updateFormData }: StepProps) {
  const toggleHealthGoal = (goal: string) => {
    const current = formData.health_goals || [];
    if (current.includes(goal)) {
      updateFormData({
        health_goals: current.filter((item) => item !== goal),
      });
    } else {
      updateFormData({
        health_goals: [...current, goal],
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Health Goals</h2>
        <p className="text-gray-600 mb-4">What are you trying to achieve?</p>
        <div className="grid grid-cols-2 gap-3">
          {HEALTH_GOALS.map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() => toggleHealthGoal(goal)}
              className={`p-3 rounded-lg border-2 transition-all ${
                formData.health_goals?.includes(goal)
                  ? "border-primary bg-primary text-white"
                  : "border-gray-200 hover:border-primary text-gray-900"
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Activity Level
        </label>
        <select
          className="input"
          value={formData.activity_level || ""}
          onChange={(e) => updateFormData({ activity_level: e.target.value })}
        >
          <option value="">Select activity level</option>
          {ACTIVITY_LEVELS.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Target Calories per Meal (optional)"
        type="number"
        placeholder="e.g., 500"
        value={formData.calorie_target || ""}
        onChange={(e) =>
          updateFormData({ calorie_target: parseInt(e.target.value) || undefined })
        }
      />

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Macro Preferences (optional)
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Protein (g)"
            type="number"
            placeholder="30"
            value={formData.macro_preferences?.protein || ""}
            onChange={(e) =>
              updateFormData({
                macro_preferences: {
                  ...formData.macro_preferences,
                  protein: parseInt(e.target.value) || undefined,
                },
              })
            }
          />
          <Input
            label="Carbs (g)"
            type="number"
            placeholder="40"
            value={formData.macro_preferences?.carbs || ""}
            onChange={(e) =>
              updateFormData({
                macro_preferences: {
                  ...formData.macro_preferences,
                  carbs: parseInt(e.target.value) || undefined,
                },
              })
            }
          />
          <Input
            label="Fat (g)"
            type="number"
            placeholder="15"
            value={formData.macro_preferences?.fat || ""}
            onChange={(e) =>
              updateFormData({
                macro_preferences: {
                  ...formData.macro_preferences,
                  fat: parseInt(e.target.value) || undefined,
                },
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
