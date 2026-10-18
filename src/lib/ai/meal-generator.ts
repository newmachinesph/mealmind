import OpenAI from "openai";
import { MealData, MealGenerationContext } from "@/types/meal";
import { buildMealGenerationPrompt, buildImagePrompt } from "./prompts";
import { generateAndUploadImage } from "./image-generator";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const mealSchema = {
  type: "object",
  properties: {
    meal_name: {
      type: "string",
      description: "The name of the meal",
    },
    description: {
      type: "string",
      description: "A 2-3 sentence description of the meal",
    },
    prep_time: {
      type: "number",
      description: "Preparation time in minutes",
    },
    cook_time: {
      type: "number",
      description: "Cooking time in minutes",
    },
    servings: {
      type: "number",
      description: "Number of servings this recipe makes",
    },
    calories: {
      type: "number",
      description: "Total calories per serving",
    },
    macros: {
      type: "object",
      properties: {
        protein: { type: "number", description: "Protein in grams" },
        carbs: { type: "number", description: "Carbohydrates in grams" },
        fat: { type: "number", description: "Fat in grams" },
      },
      required: ["protein", "carbs", "fat"],
      additionalProperties: false,
    },
    ingredients: {
      type: "array",
      items: {
        type: "object",
        properties: {
          item: { type: "string" },
          quantity: { type: "string" },
        },
        required: ["item", "quantity"],
        additionalProperties: false,
      },
    },
    instructions: {
      type: "array",
      items: {
        type: "string",
      },
      description: "Step-by-step cooking instructions",
    },
    tags: {
      type: "array",
      items: {
        type: "string",
      },
      description: "Tags like 'quick', 'healthy', 'comfort food', etc.",
    },
    cuisine_type: {
      type: "string",
      description: "Type of cuisine (e.g., Italian, Asian, Mexican)",
    },
    difficulty: {
      type: "string",
      enum: ["easy", "medium", "hard"],
      description: "Difficulty level of the recipe",
    },
  },
  required: [
    "meal_name",
    "description",
    "prep_time",
    "cook_time",
    "servings",
    "calories",
    "macros",
    "ingredients",
    "instructions",
    "tags",
    "cuisine_type",
    "difficulty",
  ],
  additionalProperties: false,
};

export async function generateMeal(context: MealGenerationContext): Promise<MealData> {
  try {
    const prompt = buildMealGenerationPrompt(context);

    // Generate meal data using structured output
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional nutritionist and chef who creates personalized meal recommendations.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "meal_recommendation",
          schema: mealSchema,
          strict: true,
        },
      },
      temperature: 0.8,
    });

    const mealData = JSON.parse(completion.choices[0].message.content || "{}");

    // Calculate total time
    mealData.total_time = mealData.prep_time + mealData.cook_time;

    // Generate and upload meal image (optional - don't fail if image generation fails)
    try {
      const imagePrompt = buildImagePrompt(
        mealData.meal_name,
        mealData.description,
        mealData.cuisine_type
      );

      const imageUrl = await generateAndUploadImage(imagePrompt);
      mealData.image_url = imageUrl;
    } catch (imageError) {
      console.warn("Failed to generate image, continuing without image:", imageError);
      // Leave image_url empty - the frontend will handle displaying a fallback
      mealData.image_url = undefined;
    }

    return mealData as MealData;
  } catch (error) {
    console.error("Error generating meal:", error);
    throw new Error("Failed to generate meal recommendation");
  }
}
