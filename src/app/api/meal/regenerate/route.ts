import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db/client";
import { generateMeal } from "@/lib/ai/meal-generator";

const DAILY_GENERATION_LIMIT = 3;

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Check current regeneration count
    const mealResult = await db.execute({
      sql: `SELECT regeneration_count FROM daily_meals
            WHERE user_id = ? AND date = ?`,
      args: [session.user.id, today],
    });

    const currentCount = mealResult.rows.length > 0
      ? (mealResult.rows[0].regeneration_count as number)
      : 0;

    // Total generations = initial generation (1) + regeneration count
    const totalGenerations = currentCount + 1;

    if (totalGenerations >= DAILY_GENERATION_LIMIT) {
      return NextResponse.json(
        {
          error: "Daily generation limit reached",
          message: `You've reached your limit of ${DAILY_GENERATION_LIMIT} meal generations per day. Try again tomorrow!`,
          generationsRemaining: 0
        },
        { status: 429 }
      );
    }

    // Get user profile
    const profileResult = await db.execute({
      sql: "SELECT * FROM user_profiles WHERE user_id = ?",
      args: [session.user.id],
    });

    if (profileResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const profile = profileResult.rows[0];

    // Get recent meals (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];

    const recentMealsResult = await db.execute({
      sql: "SELECT meal_data FROM daily_meals WHERE user_id = ? AND date >= ? ORDER BY date DESC LIMIT 7",
      args: [session.user.id, sevenDaysAgoStr],
    });

    const recentMeals = recentMealsResult.rows.map(row =>
      JSON.parse(row.meal_data as string)
    );

    // Get feedback history
    const feedbackResult = await db.execute({
      sql: `SELECT f.* FROM feedback f
            JOIN daily_meals dm ON f.meal_id = dm.id
            WHERE dm.user_id = ?
            ORDER BY f.submitted_at DESC
            LIMIT 10`,
      args: [session.user.id],
    });

    const feedbackHistory = feedbackResult.rows.map(row => ({
      did_make: row.did_make === 1,
      rating: row.rating,
      tags: row.tags ? JSON.parse(row.tags as string) : [],
      notes: row.notes,
    }));

    // Generate new meal
    const mealData = await generateMeal({
      userProfile: {
        dietary_restrictions: profile.dietary_restrictions ? JSON.parse(profile.dietary_restrictions as string) : [],
        allergies: profile.allergies ? JSON.parse(profile.allergies as string) : [],
        health_goals: profile.health_goals ? JSON.parse(profile.health_goals as string) : {},
        calorie_target: profile.calorie_target as number,
        macro_preferences: profile.macro_preferences ? JSON.parse(profile.macro_preferences as string) : null,
        cooking_skill: profile.cooking_skill as string,
        max_cook_time: profile.max_cook_time as number,
        kitchen_equipment: profile.kitchen_equipment ? JSON.parse(profile.kitchen_equipment as string) : [],
        cuisine_preferences: profile.cuisine_preferences ? JSON.parse(profile.cuisine_preferences as string) : {},
        flavor_profiles: profile.flavor_profiles ? JSON.parse(profile.flavor_profiles as string) : [],
        ingredient_preferences: profile.ingredient_preferences ? JSON.parse(profile.ingredient_preferences as string) : {},
      },
      recentMeals,
      feedbackHistory,
    });

    // Delete old meal for today if exists (we're regenerating)
    await db.execute({
      sql: "DELETE FROM daily_meals WHERE user_id = ? AND date = ?",
      args: [session.user.id, today],
    });

    // Save new meal to database with incremented regeneration count
    const insertResult = await db.execute({
      sql: `INSERT INTO daily_meals (user_id, date, meal_data, regeneration_count)
            VALUES (?, ?, ?, ?)
            RETURNING *`,
      args: [session.user.id, today, JSON.stringify(mealData), currentCount + 1],
    });

    const newMeal = insertResult.rows[0];

    return NextResponse.json({
      meal: {
        id: newMeal.id,
        user_id: newMeal.user_id,
        date: newMeal.date,
        meal_data: JSON.parse(newMeal.meal_data as string),
        confirmed: newMeal.confirmed === 1,
        generated_at: newMeal.generated_at,
      },
      generationsRemaining: DAILY_GENERATION_LIMIT - totalGenerations
    });
  } catch (error) {
    console.error("Regenerate meal error:", error);
    return NextResponse.json(
      { error: "Failed to regenerate meal" },
      { status: 500 }
    );
  }
}
