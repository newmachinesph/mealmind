import dotenv from "dotenv";
import { resolve } from "path";
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

// Load environment variables first
dotenv.config({ path: resolve(process.cwd(), ".env.local") });
dotenv.config({ path: resolve(process.cwd(), ".env") });

// Create database client
const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Hash password function
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Test accounts with different profiles
    const testAccounts = [
      {
        email: "test@mealmind.com",
        password: "Test1234",
        name: "Test User",
        age: 30,
        location: "New York, NY",
        timezone: "America/New_York",
        onboardingComplete: true,
        profile: {
          dietary_restrictions: ["vegetarian"],
          allergies: ["peanuts"],
          health_goals: {
            primary: "Weight Loss",
            calorieTarget: 1800,
            macroPreferences: { protein: 30, carbs: 40, fat: 30 },
          },
          cooking_skill: "intermediate",
          max_cook_time: 45,
          kitchen_equipment: ["oven", "stovetop", "microwave", "air fryer"],
          cuisine_preferences: {
            liked: ["Italian", "Mediterranean", "Asian"],
            disliked: ["Indian"],
          },
          flavor_profiles: { spicy: 3, sweet: 4, savory: 5 },
          ingredient_preferences: {
            loved: ["pasta", "tomatoes", "cheese", "broccoli"],
            disliked: ["mushrooms", "olives"],
          },
        },
      },
      {
        email: "vegan@mealmind.com",
        password: "Vegan1234",
        name: "Vegan User",
        age: 28,
        location: "San Francisco, CA",
        timezone: "America/Los_Angeles",
        onboardingComplete: true,
        profile: {
          dietary_restrictions: ["vegan", "gluten-free"],
          allergies: ["soy", "nuts"],
          health_goals: {
            primary: "Muscle Gain",
            calorieTarget: 2200,
            macroPreferences: { protein: 35, carbs: 45, fat: 20 },
          },
          cooking_skill: "advanced",
          max_cook_time: 60,
          kitchen_equipment: ["oven", "stovetop", "blender", "food processor"],
          cuisine_preferences: {
            liked: ["Mediterranean", "Mexican", "Thai"],
            disliked: [],
          },
          flavor_profiles: { spicy: 5, sweet: 2, savory: 4 },
          ingredient_preferences: {
            loved: ["quinoa", "chickpeas", "spinach", "sweet potato"],
            disliked: [],
          },
        },
      },
      {
        email: "keto@mealmind.com",
        password: "Keto1234",
        name: "Keto User",
        age: 35,
        location: "Austin, TX",
        timezone: "America/Chicago",
        onboardingComplete: true,
        profile: {
          dietary_restrictions: ["keto", "low-carb"],
          allergies: [],
          health_goals: {
            primary: "Weight Loss",
            calorieTarget: 1600,
            macroPreferences: { protein: 25, carbs: 5, fat: 70 },
          },
          cooking_skill: "beginner",
          max_cook_time: 30,
          kitchen_equipment: ["oven", "stovetop", "microwave"],
          cuisine_preferences: {
            liked: ["American", "Mediterranean"],
            disliked: ["Asian"],
          },
          flavor_profiles: { spicy: 2, sweet: 1, savory: 5 },
          ingredient_preferences: {
            loved: ["chicken", "bacon", "avocado", "cheese"],
            disliked: ["rice", "bread", "pasta"],
          },
        },
      },
      {
        email: "beginner@mealmind.com",
        password: "Beginner1234",
        name: "Beginner Cook",
        age: 22,
        location: "Los Angeles, CA",
        timezone: "America/Los_Angeles",
        onboardingComplete: true,
        profile: {
          dietary_restrictions: [],
          allergies: ["shellfish"],
          health_goals: {
            primary: "Healthy Eating",
            calorieTarget: 2000,
          },
          cooking_skill: "beginner",
          max_cook_time: 20,
          kitchen_equipment: ["microwave", "stovetop"],
          cuisine_preferences: {
            liked: ["American", "Italian", "Mexican"],
            disliked: [],
          },
          flavor_profiles: { spicy: 2, sweet: 3, savory: 4 },
          ingredient_preferences: {
            loved: ["chicken", "rice", "cheese"],
            disliked: ["fish", "mushrooms"],
          },
        },
      },
      {
        email: "new@mealmind.com",
        password: "New1234",
        name: "New User",
        age: 25,
        location: "Seattle, WA",
        timezone: "America/Los_Angeles",
        onboardingComplete: false,
        profile: null,
      },
    ];

    for (const account of testAccounts) {
      console.log(`Creating account: ${account.email}`);

      // Check if user already exists
      const existingUser = await db.execute({
        sql: "SELECT id FROM users WHERE email = ?",
        args: [account.email],
      });

      if (existingUser.rows.length > 0) {
        console.log(`  ⚠️  User ${account.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const passwordHash = await hashPassword(account.password);

      // Insert user
      const userResult = await db.execute({
        sql: `INSERT INTO users (id, email, password_hash, created_at, onboarding_complete, timezone)
              VALUES (lower(hex(randomblob(16))), ?, ?, strftime('%s', 'now'), ?, ?)`,
        args: [
          account.email,
          passwordHash,
          account.onboardingComplete ? 1 : 0,
          account.timezone,
        ],
      });

      // Get the user ID
      const user = await db.execute({
        sql: "SELECT id FROM users WHERE email = ?",
        args: [account.email],
      });

      const userId = user.rows[0].id as string;

      // Insert profile if onboarding complete
      if (account.onboardingComplete && account.profile) {
        await db.execute({
          sql: `INSERT INTO user_profiles (
            user_id, name, age, location,
            dietary_restrictions, allergies, health_goals,
            cuisine_preferences, cooking_skill, max_cook_time,
            kitchen_equipment, flavor_profiles, ingredient_preferences,
            updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, strftime('%s', 'now'))`,
          args: [
            userId,
            account.name,
            account.age,
            account.location,
            JSON.stringify(account.profile.dietary_restrictions),
            JSON.stringify(account.profile.allergies),
            JSON.stringify(account.profile.health_goals),
            JSON.stringify(account.profile.cuisine_preferences),
            account.profile.cooking_skill,
            account.profile.max_cook_time,
            JSON.stringify(account.profile.kitchen_equipment),
            JSON.stringify(account.profile.flavor_profiles),
            JSON.stringify(account.profile.ingredient_preferences),
          ],
        });
      }

      console.log(`  ✅ Created user: ${account.email} (${userId})`);
    }

    console.log("\n🎉 Database seeding completed!\n");
    console.log("Test Accounts:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Email: test@mealmind.com      | Password: Test1234");
    console.log("Email: vegan@mealmind.com     | Password: Vegan1234");
    console.log("Email: keto@mealmind.com      | Password: Keto1234");
    console.log("Email: beginner@mealmind.com  | Password: Beginner1234");
    console.log("Email: new@mealmind.com       | Password: New1234 (no onboarding)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
