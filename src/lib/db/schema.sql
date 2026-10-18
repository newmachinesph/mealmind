-- MealMind Database Schema for Turso (LibSQL)

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
  dietary_restrictions TEXT, -- JSON array
  allergies TEXT, -- JSON array
  health_goals TEXT, -- JSON object
  calorie_target INTEGER,
  macro_preferences TEXT, -- JSON object
  cooking_skill TEXT CHECK(cooking_skill IN ('beginner', 'intermediate', 'advanced')),
  max_cook_time INTEGER,
  kitchen_equipment TEXT, -- JSON array
  cuisine_preferences TEXT, -- JSON object with likes/dislikes
  flavor_profiles TEXT, -- JSON array
  ingredient_preferences TEXT, -- JSON object with likes/dislikes
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Daily meals table
CREATE TABLE IF NOT EXISTS daily_meals (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  date TEXT NOT NULL, -- YYYY-MM-DD format
  meal_data TEXT NOT NULL, -- JSON object with full meal details
  confirmed INTEGER NOT NULL DEFAULT 0,
  regeneration_count INTEGER NOT NULL DEFAULT 0,
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
  tags TEXT, -- JSON array
  notes TEXT,
  submitted_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (meal_id) REFERENCES daily_meals(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_feedback_meal_id ON feedback(meal_id);
CREATE INDEX IF NOT EXISTS idx_feedback_submitted_at ON feedback(submitted_at);
