import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables
process.env.TURSO_DATABASE_URL = "libsql://test.turso.io";
process.env.TURSO_AUTH_TOKEN = "test-token";
process.env.OPENAI_API_KEY = "test-openai-key";
process.env.UPLOADTHING_TOKEN = "test-uploadthing-token";
process.env.NEXTAUTH_SECRET = "test-secret";
process.env.NEXTAUTH_URL = "http://localhost:3000";
