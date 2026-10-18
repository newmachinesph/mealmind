import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db/client";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { meal_id } = body;

    if (!meal_id) {
      return NextResponse.json(
        { error: "Meal ID is required" },
        { status: 400 }
      );
    }

    // Verify meal belongs to user
    const mealResult = await db.execute({
      sql: "SELECT * FROM daily_meals WHERE id = ? AND user_id = ?",
      args: [meal_id, session.user.id],
    });

    if (mealResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Meal not found" },
        { status: 404 }
      );
    }

    // Update meal confirmation status
    await db.execute({
      sql: "UPDATE daily_meals SET confirmed = 1 WHERE id = ?",
      args: [meal_id],
    });

    return NextResponse.json({
      success: true,
      message: "Meal confirmed successfully",
    });
  } catch (error) {
    console.error("Confirm meal error:", error);
    return NextResponse.json(
      { error: "Failed to confirm meal" },
      { status: 500 }
    );
  }
}
