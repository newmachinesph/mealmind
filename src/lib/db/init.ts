import { config } from "dotenv";
import { resolve } from "path";

async function main() {
  // Load environment variables from .env BEFORE importing client
  config({ path: resolve(process.cwd(), ".env") });

  console.log("Initializing database...");
  console.log("Database URL:", process.env.TURSO_DATABASE_URL);
  try {
    // Dynamic import to ensure env vars are loaded first
    const { initializeDatabase } = await import("./client");
    await initializeDatabase();
    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
}

main();
