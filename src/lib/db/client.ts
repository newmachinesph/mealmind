import { createClient, Client } from "@libsql/client";

function getDb(): Client {
  if (!process.env.TURSO_DATABASE_URL) {
    throw new Error("TURSO_DATABASE_URL is not set");
  }

  if (!process.env.TURSO_AUTH_TOKEN) {
    throw new Error("TURSO_AUTH_TOKEN is not set");
  }

  return createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
    intMode: "number",
  });
}

export const db = getDb();

// Initialize database schema
export async function initializeDatabase() {
  const schema = `
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      onboarding_complete INTEGER NOT NULL DEFAULT 0,
      timezone TEXT DEFAULT 'UTC'
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

    -- User profiles table
    CREATE TABLE IF NOT EXISTS user_profiles (
      user_id TEXT PRIMARY KEY,
      name TEXT,
      age INTEGER,
      location TEXT,
      dietary_restrictions TEXT,
      allergies TEXT,
      health_goals TEXT,
      calorie_target INTEGER,
      macro_preferences TEXT,
      cooking_skill TEXT CHECK(cooking_skill IN ('beginner', 'intermediate', 'advanced')),
      max_cook_time INTEGER,
      kitchen_equipment TEXT,
      cuisine_preferences TEXT,
      flavor_profiles TEXT,
      ingredient_preferences TEXT,
      updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Daily meals table
    CREATE TABLE IF NOT EXISTS daily_meals (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      meal_data TEXT NOT NULL,
      confirmed INTEGER NOT NULL DEFAULT 0,
      generated_at INTEGER NOT NULL DEFAULT (unixepoch()),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, date)
    );

    CREATE INDEX IF NOT EXISTS idx_daily_meals_user_date ON daily_meals(user_id, date);

    -- Feedback table
    CREATE TABLE IF NOT EXISTS feedback (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      meal_id TEXT NOT NULL,
      did_make INTEGER NOT NULL,
      rating INTEGER CHECK(rating >= 1 AND rating <= 5),
      tags TEXT,
      notes TEXT,
      submitted_at INTEGER NOT NULL DEFAULT (unixepoch()),
      FOREIGN KEY (meal_id) REFERENCES daily_meals(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_feedback_meal_id ON feedback(meal_id);
    CREATE INDEX IF NOT EXISTS idx_feedback_submitted_at ON feedback(submitted_at);
  `;

  await db.executeMultiple(schema);
}
