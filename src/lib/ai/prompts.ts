import { MealGenerationContext } from "@/types/meal";

export function buildMealGenerationPrompt(context: MealGenerationContext): string {
  const { userProfile, recentMeals, feedbackHistory } = context;

  let prompt = `You are a professional nutritionist and chef. Generate a personalized meal recommendation for today.

USER PROFILE:
`;

  // Dietary constraints
  if (userProfile.dietary_restrictions && userProfile.dietary_restrictions.length > 0) {
    prompt += `- Dietary Restrictions: ${userProfile.dietary_restrictions.join(", ")}\n`;
  }

  if (userProfile.allergies && userProfile.allergies.length > 0) {
    prompt += `- Allergies: ${userProfile.allergies.join(", ")}\n`;
  }

  // Goals and preferences
  if (userProfile.health_goals) {
    prompt += `- Health Goals: ${JSON.stringify(userProfile.health_goals)}\n`;
  }

  if (userProfile.calorie_target) {
    prompt += `- Target Calories: ${userProfile.calorie_target} per meal\n`;
  }

  if (userProfile.macro_preferences) {
    prompt += `- Macro Preferences: Protein ${userProfile.macro_preferences.protein}g, Carbs ${userProfile.macro_preferences.carbs}g, Fat ${userProfile.macro_preferences.fat}g\n`;
  }

  // Cooking constraints
  prompt += `- Cooking Skill: ${userProfile.cooking_skill || "intermediate"}\n`;
  prompt += `- Max Cooking Time: ${userProfile.max_cook_time || 45} minutes (prep + cook)\n`;

  if (userProfile.kitchen_equipment && userProfile.kitchen_equipment.length > 0) {
    prompt += `- Available Equipment: ${userProfile.kitchen_equipment.join(", ")}\n`;
  }

  // Taste preferences
  if (userProfile.cuisine_preferences) {
    if (userProfile.cuisine_preferences.likes && userProfile.cuisine_preferences.likes.length > 0) {
      prompt += `- Preferred Cuisines: ${userProfile.cuisine_preferences.likes.join(", ")}\n`;
    }
    if (userProfile.cuisine_preferences.dislikes && userProfile.cuisine_preferences.dislikes.length > 0) {
      prompt += `- Avoid Cuisines: ${userProfile.cuisine_preferences.dislikes.join(", ")}\n`;
    }
  }

  if (userProfile.flavor_profiles && userProfile.flavor_profiles.length > 0) {
    prompt += `- Flavor Preferences: ${userProfile.flavor_profiles.join(", ")}\n`;
  }

  if (userProfile.ingredient_preferences) {
    if (userProfile.ingredient_preferences.likes && userProfile.ingredient_preferences.likes.length > 0) {
      prompt += `- Favorite Ingredients: ${userProfile.ingredient_preferences.likes.join(", ")}\n`;
    }
    if (userProfile.ingredient_preferences.dislikes && userProfile.ingredient_preferences.dislikes.length > 0) {
      prompt += `- Disliked Ingredients: ${userProfile.ingredient_preferences.dislikes.join(", ")}\n`;
    }
  }

  // Recent meals (avoid repetition)
  if (recentMeals && recentMeals.length > 0) {
    prompt += `\nRECENT MEALS (avoid similar meals):\n`;
    recentMeals.forEach((meal, index) => {
      prompt += `${index + 1}. ${meal.meal_name} (${meal.cuisine_type || "N/A"})\n`;
    });
  }

  // Feedback patterns
  if (feedbackHistory && feedbackHistory.length > 0) {
    prompt += `\nFEEDBACK PATTERNS:\n`;
    const avgRating = feedbackHistory
      .filter(f => f.rating)
      .reduce((sum, f) => sum + (f.rating || 0), 0) / feedbackHistory.filter(f => f.rating).length;
    prompt += `- Average Rating: ${avgRating.toFixed(1)}/5\n`;

    const commonTags = feedbackHistory
      .flatMap(f => f.tags || [])
      .reduce((acc: any, tag: string) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {});

    if (Object.keys(commonTags).length > 0) {
      prompt += `- Common Feedback: ${Object.entries(commonTags)
        .map(([tag, count]) => `${tag} (${count}x)`)
        .join(", ")}\n`;
    }
  }

  prompt += `
REQUIREMENTS:
1. The meal MUST strictly adhere to all dietary restrictions and allergies
2. Stay within the cooking time and skill level constraints
3. Provide variety - don't repeat recent meals or main ingredients
4. Create a balanced, nutritious meal that aligns with health goals
5. Use ingredients that are commonly available in grocery stores
6. Provide clear, step-by-step cooking instructions
7. Calculate accurate nutritional information

Generate a meal that this user will love and want to make!`;

  return prompt;
}

export function buildImagePrompt(mealName: string, description: string, cuisineType?: string): string {
  return `A professional, appetizing food photography shot of ${mealName}. ${description}. ${
    cuisineType ? `${cuisineType} cuisine style.` : ""
  } The dish is beautifully plated on a clean white plate, shot from a 45-degree angle with natural lighting. The food looks fresh, vibrant, and delicious. Professional food photography, high resolution, magazine quality, shallow depth of field, garnished appropriately.`;
}
