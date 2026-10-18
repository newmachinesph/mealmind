"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { OnboardingData } from "@/types/user";
import Step1Basics from "@/components/onboarding/Step1Basics";
import Step2Dietary from "@/components/onboarding/Step2Dietary";
import Step3Goals from "@/components/onboarding/Step3Goals";
import Step4Lifestyle from "@/components/onboarding/Step4Lifestyle";
import Step5Taste from "@/components/onboarding/Step5Taste";

const TOTAL_STEPS = 5;

export default function ProfileEditClient() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    dietary_restrictions: [],
    allergies: [],
    health_goals: [],
    kitchen_equipment: [],
    cuisine_likes: [],
    cuisine_dislikes: [],
    flavor_profiles: [],
    ingredient_likes: [],
    ingredient_dislikes: [],
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/profile");
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        const profile = data.profile;

        // Map profile data to form data
        setFormData({
          name: profile.name,
          age: profile.age,
          location: profile.location,
          timezone: profile.timezone,
          dietary_restrictions: profile.dietary_restrictions || [],
          allergies: profile.allergies || [],
          health_goals: profile.health_goals?.goals || [],
          weight_goal: profile.health_goals?.weight_goal || "",
          activity_level: profile.health_goals?.activity_level || "",
          calorie_target: profile.calorie_target || 0,
          macro_preferences: profile.macro_preferences || {},
          cooking_skill: profile.cooking_skill || "beginner",
          max_cook_time: profile.max_cook_time || 0,
          kitchen_equipment: profile.kitchen_equipment || [],
          cuisine_likes: profile.cuisine_preferences?.likes || [],
          cuisine_dislikes: profile.cuisine_preferences?.dislikes || [],
          flavor_profiles: profile.flavor_profiles || [],
          ingredient_likes: profile.ingredient_preferences?.likes || [],
          ingredient_dislikes: profile.ingredient_preferences?.dislikes || [],
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
        alert("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const updateFormData = (data: Partial<OnboardingData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to save preferences");
      }

      // Redirect to profile page
      router.push("/profile");
    } catch (error) {
      console.error("Save error:", error);
      alert(`Failed to save your preferences: ${error instanceof Error ? error.message : 'Please try again.'}`);
      setIsSaving(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Basics formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <Step2Dietary formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <Step3Goals formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <Step4Lifestyle formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <Step5Taste formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Edit Your Preferences
        </h1>
        <p className="text-gray-600">
          Step {currentStep} of {TOTAL_STEPS}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
          ></div>
        </div>
      </div>

      <Card className="animate-slide-up">
        {renderStep()}

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || isSaving}
          >
            Back
          </Button>
          {currentStep < TOTAL_STEPS ? (
            <Button onClick={handleNext} disabled={isSaving}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} isLoading={isSaving}>
              Save Changes
            </Button>
          )}
        </div>
      </Card>

      <div className="text-center mt-4">
        <Button
          variant="outline"
          onClick={() => router.push("/profile")}
          disabled={isSaving}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
