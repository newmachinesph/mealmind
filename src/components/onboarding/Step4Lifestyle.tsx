"use client";

import Input from "@/components/ui/Input";
import { OnboardingData } from "@/types/user";

interface StepProps {
  formData: Partial<OnboardingData>;
  updateFormData: (data: Partial<OnboardingData>) => void;
}

const COOKING_SKILLS = [
  { value: "beginner", label: "Beginner", desc: "I follow simple recipes" },
  { value: "intermediate", label: "Intermediate", desc: "Comfortable with most techniques" },
  { value: "advanced", label: "Advanced", desc: "I can cook complex dishes" },
];

const KITCHEN_EQUIPMENT = [
  "Oven",
  "Stovetop",
  "Microwave",
  "Air Fryer",
  "Slow Cooker",
  "Instant Pot",
  "Blender",
  "Food Processor",
  "Grill",
  "Toaster Oven",
];

export default function Step4Lifestyle({ formData, updateFormData }: StepProps) {
  const toggleEquipment = (equipment: string) => {
    const current = formData.kitchen_equipment || [];
    if (current.includes(equipment)) {
      updateFormData({
        kitchen_equipment: current.filter((item) => item !== equipment),
      });
    } else {
      updateFormData({
        kitchen_equipment: [...current, equipment],
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cooking Skills</h2>
        <p className="text-gray-600 mb-4">How would you rate your cooking ability?</p>
        <div className="space-y-3">
          {COOKING_SKILLS.map((skill) => (
            <button
              key={skill.value}
              type="button"
              onClick={() =>
                updateFormData({
                  cooking_skill: skill.value as "beginner" | "intermediate" | "advanced",
                })
              }
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                formData.cooking_skill === skill.value
                  ? "border-primary bg-primary bg-opacity-10 text-gray-900"
                  : "border-gray-200 hover:border-primary text-gray-900"
              }`}
            >
              <div className="font-semibold text-gray-900">{skill.label}</div>
              <div className="text-sm text-gray-600">{skill.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Maximum Cooking Time (minutes)"
        type="number"
        placeholder="e.g., 45"
        value={formData.max_cook_time || ""}
        onChange={(e) =>
          updateFormData({ max_cook_time: parseInt(e.target.value) || undefined })
        }
        required
      />

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Kitchen Equipment
        </h2>
        <p className="text-gray-600 mb-4">What equipment do you have available?</p>
        <div className="grid grid-cols-2 gap-3">
          {KITCHEN_EQUIPMENT.map((equipment) => (
            <button
              key={equipment}
              type="button"
              onClick={() => toggleEquipment(equipment)}
              className={`p-3 rounded-lg border-2 transition-all ${
                formData.kitchen_equipment?.includes(equipment)
                  ? "border-primary bg-primary text-white"
                  : "border-gray-200 hover:border-primary text-gray-900"
              }`}
            >
              {equipment}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
