import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db/client";
import { OnboardingData } from "@/types/user";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: OnboardingData = await request.json();

    // Get timezone from browser or default to UTC
    const timezone = body.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

    // Prepare arguments with proper defaults
    const args = [
      session.user.id,
      body.name || "",
      body.age || 0,
      body.location || "",
      JSON.stringify(body.dietary_restrictions || []),
      JSON.stringify(body.allergies || []),
      JSON.stringify({
        goals: body.health_goals || [],
        weight_goal: body.weight_goal || "",
        activity_level: body.activity_level || "",
      }),
      body.calorie_target || 0,
      JSON.stringify(body.macro_preferences || {}),
      body.cooking_skill || "beginner",
      body.max_cook_time || 0,
      JSON.stringify(body.kitchen_equipment || []),
      JSON.stringify({
        likes: body.cuisine_likes || [],
        dislikes: body.cuisine_dislikes || [],
      }),
      JSON.stringify(body.flavor_profiles || []),
      JSON.stringify({
        likes: body.ingredient_likes || [],
        dislikes: body.ingredient_dislikes || [],
      }),
    ];

    // Log args for debugging
    console.log("Onboarding submission for user:", session.user.id);
    console.log("Form data received:", Object.keys(body));

    // Create user profile
    console.log("Inserting user profile...");
    await db.execute({
      sql: `INSERT INTO user_profiles (
        user_id, name, age, location,
        dietary_restrictions, allergies,
        health_goals, calorie_target, macro_preferences,
        cooking_skill, max_cook_time, kitchen_equipment,
        cuisine_preferences, flavor_profiles, ingredient_preferences
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        name = excluded.name,
        age = excluded.age,
        location = excluded.location,
        dietary_restrictions = excluded.dietary_restrictions,
        allergies = excluded.allergies,
        health_goals = excluded.health_goals,
        calorie_target = excluded.calorie_target,
        macro_preferences = excluded.macro_preferences,
        cooking_skill = excluded.cooking_skill,
        max_cook_time = excluded.max_cook_time,
        kitchen_equipment = excluded.kitchen_equipment,
        cuisine_preferences = excluded.cuisine_preferences,
        flavor_profiles = excluded.flavor_profiles,
        ingredient_preferences = excluded.ingredient_preferences,
        updated_at = unixepoch()`,
      args,
    });
    console.log("User profile inserted successfully");

    // Update user onboarding status
    console.log("Updating user onboarding status...");
    await db.execute({
      sql: "UPDATE users SET onboarding_complete = 1, timezone = ? WHERE id = ?",
      args: [timezone, session.user.id],
    });
    console.log("Onboarding completed successfully");

    return NextResponse.json({
      success: true,
      message: "Onboarding completed successfully",
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    console.error("Error details:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      {
        error: "Failed to save onboarding data",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
