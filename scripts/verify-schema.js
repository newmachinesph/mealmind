const { createClient } = require("@libsql/client");
require("dotenv").config();

async function verifySchema() {
  const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    console.log("🔍 Verifying database schema...\n");

    // Get all tables
    const tables = await db.execute(`
      SELECT name FROM sqlite_master
      WHERE type='table'
      ORDER BY name
    `);

    console.log("📋 Tables:");
    tables.rows.forEach(row => {
      console.log(`  ✓ ${row.name}`);
    });

    // Check daily_meals table structure
    console.log("\n📊 daily_meals table columns:");
    const columns = await db.execute("PRAGMA table_info(daily_meals)");
    columns.rows.forEach(col => {
      console.log(`  ✓ ${col.name} (${col.type})${col.dflt_value ? ` DEFAULT ${col.dflt_value}` : ''}`);
    });

    // Verify regeneration_count column exists
    const hasRegenerationCount = columns.rows.some(col => col.name === 'regeneration_count');

    if (hasRegenerationCount) {
      console.log("\n✅ SUCCESS: regeneration_count column exists in daily_meals table!");
    } else {
      console.log("\n❌ ERROR: regeneration_count column is missing!");
    }

  } catch (error) {
    console.error("❌ Error verifying schema:", error);
    process.exit(1);
  } finally {
    db.close();
  }
}

verifySchema();
