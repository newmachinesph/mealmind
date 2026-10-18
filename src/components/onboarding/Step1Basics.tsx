"use client";

import Input from "@/components/ui/Input";
import { OnboardingData } from "@/types/user";

interface StepProps {
  formData: Partial<OnboardingData>;
  updateFormData: (data: Partial<OnboardingData>) => void;
}

export default function Step1Basics({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Tell us about yourself
      </h2>

      <Input
        label="Name"
        type="text"
        placeholder="Your name"
        value={formData.name || ""}
        onChange={(e) => updateFormData({ name: e.target.value })}
        required
      />

      <Input
        label="Age"
        type="number"
        placeholder="Your age"
        value={formData.age || ""}
        onChange={(e) => updateFormData({ age: parseInt(e.target.value) })}
        required
      />

      <Input
        label="Location"
        type="text"
        placeholder="City, Country"
        value={formData.location || ""}
        onChange={(e) => updateFormData({ location: e.target.value })}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timezone
        </label>
        <select
          className="input"
          value={formData.timezone || ""}
          onChange={(e) => updateFormData({ timezone: e.target.value })}
          required
        >
          <option value="">Select timezone</option>
          <option value="America/New_York">Eastern Time (ET)</option>
          <option value="America/Chicago">Central Time (CT)</option>
          <option value="America/Denver">Mountain Time (MT)</option>
          <option value="America/Los_Angeles">Pacific Time (PT)</option>
          <option value="Europe/London">London (GMT)</option>
          <option value="Europe/Paris">Central European Time</option>
          <option value="Asia/Tokyo">Tokyo</option>
          <option value="Asia/Singapore">Singapore</option>
          <option value="Australia/Sydney">Sydney</option>
        </select>
      </div>
    </div>
  );
}
