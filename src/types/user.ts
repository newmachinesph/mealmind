export interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: number;
  onboarding_complete: number;
  timezone: string;
}

export interface UserProfile {
  user_id: string;
  name?: string;
  age?: number;
  location?: string;
  dietary_restrictions?: string[];
  allergies?: string[];
  health_goals?: {
    goals: string[];
    weight_goal?: string;
    activity_level?: string;
  };
  calorie_target?: number;
  macro_preferences?: {
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  cooking_skill?: 'beginner' | 'intermediate' | 'advanced';
  max_cook_time?: number;
  kitchen_equipment?: string[];
  cuisine_preferences?: {
    likes?: string[];
    dislikes?: string[];
  };
  flavor_profiles?: string[];
  ingredient_preferences?: {
    likes?: string[];
    dislikes?: string[];
  };
  updated_at: number;
}

export interface OnboardingData {
  // Step 1: Basics
  name: string;
  age: number;
  location: string;
  timezone: string;

  // Step 2: Dietary
  dietary_restrictions: string[];
  allergies: string[];

  // Step 3: Goals
  health_goals: string[];
  weight_goal?: string;
  activity_level?: string;
  calorie_target?: number;
  macro_preferences?: {
    protein?: number;
    carbs?: number;
    fat?: number;
  };

  // Step 4: Lifestyle
  cooking_skill: 'beginner' | 'intermediate' | 'advanced';
  max_cook_time: number;
  kitchen_equipment: string[];

  // Step 5: Taste
  cuisine_likes: string[];
  cuisine_dislikes: string[];
  flavor_profiles: string[];
  ingredient_likes: string[];
  ingredient_dislikes: string[];
}
