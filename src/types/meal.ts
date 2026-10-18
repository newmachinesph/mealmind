export interface Meal {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  meal_data: MealData;
  confirmed: number;
  generated_at: number;
}

export interface MealData {
  meal_name: string;
  description: string;
  prep_time: number;
  cook_time: number;
  total_time: number;
  servings: number;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  ingredients: Ingredient[];
  instructions: string[];
  image_url?: string;
  tags?: string[];
  cuisine_type?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Ingredient {
  item: string;
  quantity: string;
  notes?: string;
}

export interface MealGenerationContext {
  userProfile: {
    dietary_restrictions?: string[];
    allergies?: string[];
    health_goals?: any;
    calorie_target?: number;
    macro_preferences?: any;
    cooking_skill?: string;
    max_cook_time?: number;
    kitchen_equipment?: string[];
    cuisine_preferences?: any;
    flavor_profiles?: string[];
    ingredient_preferences?: any;
  };
  recentMeals?: MealData[];
  feedbackHistory?: any[];
}
