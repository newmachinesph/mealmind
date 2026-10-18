import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db/client";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all feedback for this user with meal data
    const feedbackResult = await db.execute({
      sql: `SELECT
              f.id,
              f.meal_id,
              f.did_make,
              f.rating,
              f.tags,
              f.notes,
              f.submitted_at,
              dm.date,
              dm.meal_data
            FROM feedback f
            JOIN daily_meals dm ON f.meal_id = dm.id
            WHERE dm.user_id = ?
            ORDER BY f.submitted_at DESC`,
      args: [session.user.id],
    });

    const feedbackHistory = feedbackResult.rows.map(row => ({
      id: row.id,
      meal_id: row.meal_id,
      did_make: row.did_make === 1,
      rating: row.rating,
      tags: row.tags ? JSON.parse(row.tags as string) : [],
      notes: row.notes,
      submitted_at: row.submitted_at,
      meal_date: row.date,
      meal_data: JSON.parse(row.meal_data as string),
    }));

    return NextResponse.json({
      feedback: feedbackHistory,
    });
  } catch (error) {
    console.error("Get feedback history error:", error);
    return NextResponse.json(
      { error: "Failed to get feedback history" },
      { status: 500 }
    );
  }
}
