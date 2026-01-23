/**
 * TEST 1: UNIT TESTING
 * 
 * Lecture Topic: Unit Testing
 * - Checks individual functions within a file
 * - Uses AAA (Arrange, Act, Assert) pattern
 * - Should be atomic and independent
 * 
 * This demonstrates:
 * - Testing a single function in isolation
 * - AAA pattern from lecture
 * - Pure function testing with no external dependencies
 */

const bcrypt = require("bcrypt");

// Simple utility functions to test
const authUtils = {
    hashPassword: function (password) {
        if (!password || password.length === 0) {
            throw new Error("Password cannot be empty");
        }
        return bcrypt.hashSync(password, 10);
    },

    comparePassword: function (plainPassword, hashedPassword) {
        return bcrypt.compareSync(plainPassword, hashedPassword);
    }
};

describe("Unit Testing - Password Validation", () => {

    /**
     * Test: Validate password hashing
     * AAA Pattern demonstration
     */
    test("Should hash password correctly", () => {
        // ARRANGE - Set up test data
        const plainPassword = "testPassword123";

        // ACT - Execute the function being tested
        const hashedPassword = authUtils.hashPassword(plainPassword);

        // ASSERT - Verify the result
        expect(hashedPassword).not.toBe(plainPassword);
        expect(hashedPassword).toContain("$"); // bcrypt hash marker
    });

    /**
     * Test: Password comparison
     * Shows testing of related functions
     */
    test("Should compare passwords correctly", () => {
        // ARRANGE
        const plainPassword = "mySecretPassword";
        const hashedPassword = authUtils.hashPassword(plainPassword);

        // ACT
        const isMatch = authUtils.comparePassword(plainPassword, hashedPassword);
        const isNotMatch = authUtils.comparePassword("wrongPassword", hashedPassword);

        // ASSERT
        expect(isMatch).toBe(true);
        expect(isNotMatch).toBe(false);
    });

    /**
     * Test: Edge case testing
     * Demonstrates testing boundary conditions
     */
    test("Should handle empty password", () => {
        // ARRANGE
        const emptyPassword = "";

        // ACT & ASSERT
        expect(() => {
            authUtils.hashPassword(emptyPassword);
        }).toThrow("Password cannot be empty");
    });
});

/**
 * Key Concepts Demonstrated:
 * 1. Unit Testing - Individual function testing
 * 2. AAA Pattern - Arrange, Act, Assert structure
 * 3. Independence - Each test is atomic
 * 4. Edge Cases - Testing boundary conditions
 */