import type { User, UserProfile, Meal, MealData, Feedback } from "@/types";

export const mockUser: User = {
  id: "test-user-id",
  email: "test@example.com",
  password_hash: "hashed_password",
  created_at: Date.now(),
  onboarding_complete: 1,
  timezone: "America/New_York",
};

export const mockUserProfile: UserProfile = {
  user_id: "test-user-id",
  name: "Test User",
  age: 30,
  location: "New York, NY",
  dietary_restrictions: ["vegetarian"],
  allergies: ["peanuts"],
  health_goals: {
    goals: ["Weight Loss"],
    weight_goal: "lose",
    activity_level: "moderate",
  },
  calorie_target: 1800,
  macro_preferences: { protein: 30, carbs: 40, fat: 30 },
  cuisine_preferences: {
    likes: ["Italian", "Mediterranean"],
    dislikes: ["Indian"],
  },
  cooking_skill: "intermediate",
  max_cook_time: 45,
  kitchen_equipment: ["oven", "stovetop", "microwave"],
  flavor_profiles: ["savory", "herby"],
  ingredient_preferences: {
    likes: ["pasta", "tomatoes"],
    dislikes: ["mushrooms"],
  },
  updated_at: Date.now(),
};

export const mockMealData: MealData = {
  meal_name: "Vegetarian Pasta Primavera",
  description:
    "A light and healthy pasta dish loaded with fresh vegetables and a garlic herb sauce.",
  prep_time: 15,
  cook_time: 20,
  total_time: 35,
  servings: 2,
  calories: 450,
  macros: { protein: 15, carbs: 65, fat: 12 },
  ingredients: [
    { item: "Pasta", quantity: "8 oz" },
    { item: "Bell peppers", quantity: "2" },
    { item: "Zucchini", quantity: "1" },
    { item: "Tomatoes", quantity: "3" },
    { item: "Garlic", quantity: "3 cloves" },
    { item: "Olive oil", quantity: "2 tbsp" },
  ],
  instructions: [
    "Cook pasta according to package directions",
    "Chop all vegetables",
    "Sauté garlic in olive oil",
    "Add vegetables and cook until tender",
    "Toss with pasta and season",
  ],
  image_url: "https://example.com/pasta.jpg",
  cuisine_type: "Italian",
  difficulty: "easy",
};

export const mockMeal: Meal = {
  id: "test-meal-id",
  user_id: "test-user-id",
  date: "2025-01-11",
  meal_data: mockMealData,
  confirmed: 0,
  generated_at: Date.now(),
};

export const mockFeedback: Feedback = {
  id: "test-feedback-id",
  meal_id: "test-meal-id",
  did_make: 1,
  rating: 5,
  tags: ["will_make_again"],
  notes: "Delicious and quick!",
  submitted_at: Date.now(),
};

export const mockOnboardingData = {
  name: "Test User",
  age: 30,
  location: "New York, NY",
  timezone: "America/New_York",
  dietary_restrictions: ["vegetarian"],
  allergies: ["peanuts"],
  health_goals: ["Weight Loss"],
  weight_goal: "lose",
  activity_level: "moderate",
  calorie_target: 1800,
  macro_preferences: { protein: 30, carbs: 40, fat: 30 },
  cooking_skill: "intermediate" as const,
  max_cook_time: 45,
  kitchen_equipment: ["oven", "stovetop"],
  cuisine_likes: ["Italian"],
  cuisine_dislikes: [],
  flavor_profiles: ["savory", "herby"],
  ingredient_likes: ["pasta"],
  ingredient_dislikes: ["mushrooms"],
};
