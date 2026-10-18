const { createClient } = require("@libsql/client");
require("dotenv").config();

async function resetDatabase() {
  const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    console.log("🗑️  Dropping existing tables...");

    // Drop tables in reverse order of dependencies
    await db.execute("DROP TABLE IF EXISTS feedback");
    await db.execute("DROP TABLE IF EXISTS daily_meals");
    await db.execute("DROP TABLE IF EXISTS user_profiles");
    await db.execute("DROP TABLE IF EXISTS users");

    console.log("✅ Tables dropped successfully");

    console.log("🔨 Creating fresh schema...");

    // Create users table
    await db.execute(`
      CREATE TABLE users (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        onboarding_complete INTEGER NOT NULL DEFAULT 0,
        timezone TEXT DEFAULT 'UTC'
      )
    `);

    await db.execute("CREATE INDEX idx_users_email ON users(email)");
    console.log("✅ Created users table");

    // Create user_profiles table
    await db.execute(`
      CREATE TABLE user_profiles (
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
      )
    `);
    console.log("✅ Created user_profiles table");

    // Create daily_meals table with regeneration_count
    await db.execute(`
      CREATE TABLE daily_meals (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT NOT NULL,
        date TEXT NOT NULL,
        meal_data TEXT NOT NULL,
        confirmed INTEGER NOT NULL DEFAULT 0,
        regeneration_count INTEGER NOT NULL DEFAULT 0,
        generated_at INTEGER NOT NULL DEFAULT (unixepoch()),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user_id, date)
      )
    `);

    await db.execute("CREATE INDEX idx_daily_meals_user_date ON daily_meals(user_id, date)");
    console.log("✅ Created daily_meals table with regeneration_count column");

    // Create feedback table
    await db.execute(`
      CREATE TABLE feedback (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        meal_id TEXT NOT NULL,
        did_make INTEGER NOT NULL,
        rating INTEGER CHECK(rating >= 1 AND rating <= 5),
        tags TEXT,
        notes TEXT,
        submitted_at INTEGER NOT NULL DEFAULT (unixepoch()),
        FOREIGN KEY (meal_id) REFERENCES daily_meals(id) ON DELETE CASCADE
      )
    `);

    await db.execute("CREATE INDEX idx_feedback_meal_id ON feedback(meal_id)");
    await db.execute("CREATE INDEX idx_feedback_submitted_at ON feedback(submitted_at)");
    console.log("✅ Created feedback table");

    console.log("\n🎉 Database reset complete! All tables created with fresh schema.");
    console.log("✨ The regeneration_count column is now in the daily_meals table.");

  } catch (error) {
    console.error("❌ Error resetting database:", error);
    process.exit(1);
  } finally {
    db.close();
  }
}

resetDatabase();
