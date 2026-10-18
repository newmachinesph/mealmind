import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db/client";
import { UserProfile } from "@/types/user";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await db.execute({
      sql: `SELECT
        up.*,
        u.email,
        u.timezone,
        u.onboarding_complete
      FROM user_profiles up
      JOIN users u ON u.id = up.user_id
      WHERE up.user_id = ?`,
      args: [session.user.id],
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const row = result.rows[0];

    const profile: UserProfile & { email: string; timezone: string } = {
      user_id: row.user_id as string,
      name: row.name as string,
      age: row.age as number,
      location: row.location as string,
      dietary_restrictions: row.dietary_restrictions ? JSON.parse(row.dietary_restrictions as string) : [],
      allergies: row.allergies ? JSON.parse(row.allergies as string) : [],
      health_goals: row.health_goals ? JSON.parse(row.health_goals as string) : {},
      calorie_target: row.calorie_target as number,
      macro_preferences: row.macro_preferences ? JSON.parse(row.macro_preferences as string) : null,
      cooking_skill: row.cooking_skill as 'beginner' | 'intermediate' | 'advanced',
      max_cook_time: row.max_cook_time as number,
      kitchen_equipment: row.kitchen_equipment ? JSON.parse(row.kitchen_equipment as string) : [],
      cuisine_preferences: row.cuisine_preferences ? JSON.parse(row.cuisine_preferences as string) : {},
      flavor_profiles: row.flavor_profiles ? JSON.parse(row.flavor_profiles as string) : [],
      ingredient_preferences: row.ingredient_preferences ? JSON.parse(row.ingredient_preferences as string) : {},
      updated_at: row.updated_at as number,
      email: row.email as string,
      timezone: row.timezone as string,
    };

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Build dynamic update query based on provided fields
    const updateFields = [];
    const args = [];

    if (body.dietary_restrictions !== undefined) {
      updateFields.push("dietary_restrictions = ?");
      args.push(JSON.stringify(body.dietary_restrictions));
    }
    if (body.allergies !== undefined) {
      updateFields.push("allergies = ?");
      args.push(JSON.stringify(body.allergies));
    }
    if (body.health_goals !== undefined) {
      updateFields.push("health_goals = ?");
      args.push(JSON.stringify(body.health_goals));
    }
    if (body.calorie_target !== undefined) {
      updateFields.push("calorie_target = ?");
      args.push(body.calorie_target);
    }
    if (body.macro_preferences !== undefined) {
      updateFields.push("macro_preferences = ?");
      args.push(JSON.stringify(body.macro_preferences));
    }
    if (body.cooking_skill !== undefined) {
      updateFields.push("cooking_skill = ?");
      args.push(body.cooking_skill);
    }
    if (body.max_cook_time !== undefined) {
      updateFields.push("max_cook_time = ?");
      args.push(body.max_cook_time);
    }
    if (body.kitchen_equipment !== undefined) {
      updateFields.push("kitchen_equipment = ?");
      args.push(JSON.stringify(body.kitchen_equipment));
    }
    if (body.cuisine_preferences !== undefined) {
      updateFields.push("cuisine_preferences = ?");
      args.push(JSON.stringify(body.cuisine_preferences));
    }
    if (body.flavor_profiles !== undefined) {
      updateFields.push("flavor_profiles = ?");
      args.push(JSON.stringify(body.flavor_profiles));
    }
    if (body.ingredient_preferences !== undefined) {
      updateFields.push("ingredient_preferences = ?");
      args.push(JSON.stringify(body.ingredient_preferences));
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    updateFields.push("updated_at = unixepoch()");
    args.push(session.user.id);

    await db.execute({
      sql: `UPDATE user_profiles SET ${updateFields.join(", ")} WHERE user_id = ?`,
      args,
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
