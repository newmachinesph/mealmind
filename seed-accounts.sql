-- Seed test accounts for MealMind
-- Run this SQL directly in your Turso dashboard or CLI

-- Test User (vegetarian)
INSERT INTO users (id, email, password_hash, created_at, onboarding_complete, timezone)
VALUES (lower(hex(randomblob(16))), 'test@mealmind.com', '$2a$10$YourHashedPasswordHere', strftime('%s', 'now'), 1, 'America/New_York');

-- Vegan User
INSERT INTO users (id, email, password_hash, created_at, onboarding_complete, timezone)
VALUES (lower(hex(randomblob(16))), 'vegan@mealmind.com', '$2a$10$YourHashedPasswordHere', strftime('%s', 'now'), 1, 'America/Los_Angeles');

-- Keto User
INSERT INTO users (id, email, password_hash, created_at, onboarding_complete, timezone)
VALUES (lower(hex(randomblob(16))), 'keto@mealmind.com', '$2a$10$YourHashedPasswordHere', strftime('%s', 'now'), 1, 'America/Chicago');

-- Beginner Cook
INSERT INTO users (id, email, password_hash, created_at, onboarding_complete, timezone)
VALUES (lower(hex(randomblob(16))), 'beginner@mealmind.com', '$2a$10$YourHashedPasswordHere', strftime('%s', 'now'), 1, 'America/Los_Angeles');

-- New User (no onboarding)
INSERT INTO users (id, email, password_hash, created_at, onboarding_complete, timezone)
VALUES (lower(hex(randomblob(16))), 'new@mealmind.com', '$2a$10$YourHashedPasswordHere', strftime('%s', 'now'), 0, 'America/Los_Angeles');
