"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { OnboardingData } from "@/types/user";
import Step1Basics from "./Step1Basics";
import Step2Dietary from "./Step2Dietary";
import Step3Goals from "./Step3Goals";
import Step4Lifestyle from "./Step4Lifestyle";
import Step5Taste from "./Step5Taste";

const TOTAL_STEPS = 5;

export default function OnboardingFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);

    try {
      console.log("Submitting onboarding data:", formData);
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to save onboarding data");
      }

      // Force a full page reload to refresh the session with updated onboarding status
      window.location.href = "/meal/today";
    } catch (error) {
      console.error("Onboarding error:", error);
      alert(`Failed to save your preferences: ${error instanceof Error ? error.message : 'Please try again.'}`);
      setIsLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Let's personalize your meals
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
              disabled={currentStep === 1 || isLoading}
            >
              Back
            </Button>
            {currentStep < TOTAL_STEPS ? (
              <Button onClick={handleNext} disabled={isLoading}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} isLoading={isLoading}>
                Complete Setup
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
