import { describe, it, expect, vi } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

describe("Authentication Integration Tests", () => {
  describe("User Registration Flow", () => {
    it("should hash password during registration", async () => {
      const password = "TestPassword123";
      const hashedPassword = await hashPassword(password);

      // Password should be hashed
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword).toBeTruthy();
      expect(hashedPassword.length).toBeGreaterThan(20);
    });

    it("should verify password during login", async () => {
      const password = "TestPassword123";
      const hashedPassword = await hashPassword(password);

      // Correct password should verify
      const isValid = await verifyPassword(password, hashedPassword);
      expect(isValid).toBe(true);

      // Incorrect password should not verify
      const isInvalid = await verifyPassword("WrongPassword", hashedPassword);
      expect(isInvalid).toBe(false);
    });
  });

  describe("Password Security", () => {
    it("should use bcrypt salt rounds for security", async () => {
      const password = "Test1234";
      const hash = await hashPassword(password);

      // Bcrypt hashes start with $2a$ or $2b$ followed by cost factor
      expect(hash).toMatch(/^\$2[ab]\$/);
    });

    it("should generate unique hashes for same password", async () => {
      const password = "Test1234";
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      // Each hash should be unique due to salt
      expect(hash1).not.toBe(hash2);

      // But both should verify with the same password
      expect(await verifyPassword(password, hash1)).toBe(true);
      expect(await verifyPassword(password, hash2)).toBe(true);
    });
  });
});
