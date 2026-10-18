import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db/client";
import { FeedbackSubmission } from "@/types/feedback";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: FeedbackSubmission = await request.json();
    const { meal_id, did_make, rating, tags, notes } = body;

    if (!meal_id || did_make === undefined) {
      return NextResponse.json(
        { error: "Meal ID and did_make are required" },
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

    // Check if feedback already exists
    const existingFeedback = await db.execute({
      sql: "SELECT id FROM feedback WHERE meal_id = ?",
      args: [meal_id],
    });

    if (existingFeedback.rows.length > 0) {
      // Update existing feedback
      await db.execute({
        sql: `UPDATE feedback
              SET did_make = ?, rating = ?, tags = ?, notes = ?, submitted_at = unixepoch()
              WHERE meal_id = ?`,
        args: [
          did_make ? 1 : 0,
          rating || null,
          tags ? JSON.stringify(tags) : null,
          notes || null,
          meal_id,
        ],
      });
    } else {
      // Insert new feedback
      await db.execute({
        sql: `INSERT INTO feedback (meal_id, did_make, rating, tags, notes)
              VALUES (?, ?, ?, ?, ?)`,
        args: [
          meal_id,
          did_make ? 1 : 0,
          rating || null,
          tags ? JSON.stringify(tags) : null,
          notes || null,
        ],
      });
    }

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    console.error("Submit feedback error:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const mealId = searchParams.get("meal_id");

    if (!mealId) {
      return NextResponse.json(
        { error: "Meal ID is required" },
        { status: 400 }
      );
    }

    // Verify meal belongs to user and get feedback
    const result = await db.execute({
      sql: `SELECT f.* FROM feedback f
            JOIN daily_meals dm ON f.meal_id = dm.id
            WHERE f.meal_id = ? AND dm.user_id = ?`,
      args: [mealId, session.user.id],
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { feedback: null },
        { status: 200 }
      );
    }

    const feedback = result.rows[0];

    return NextResponse.json({
      feedback: {
        id: feedback.id,
        meal_id: feedback.meal_id,
        did_make: feedback.did_make === 1,
        rating: feedback.rating,
        tags: feedback.tags ? JSON.parse(feedback.tags as string) : [],
        notes: feedback.notes,
        submitted_at: feedback.submitted_at,
      },
    });
  } catch (error) {
    console.error("Get feedback error:", error);
    return NextResponse.json(
      { error: "Failed to get feedback" },
      { status: 500 }
    );
  }
}
