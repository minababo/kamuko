const request = require("supertest");
const { createApp } = require("../src/app");
const { connectDB } = require("../src/config/db");
const User = require("../src/models/User");
const mongoose = require("mongoose");

/**
 * TEST 2: INTEGRATION TESTING
 * 
 * Lecture Topic: Integration Testing
 * - Tests interaction between components
 * - Tests the connections between parts of the system
 * - Uses real HTTP requests to test routes
 * 
 * This demonstrates:
 * - Testing multiple components working together
 * - HTTP request/response cycle
 * - Database interaction
 */

let app;

describe("Integration Testing - User Registration", () => {

    beforeAll(async () => {
        // Setup: Connect to test database before all tests
        app = createApp();
        await connectDB();
    });

    afterAll(async () => {
        // Teardown: Clean up test data and close connection
        await User.deleteMany({ email: /test.*@integration\.com/ });
        await mongoose.connection.close();
    });

    /**
     * Test: Complete registration flow
     * Tests interaction between: Route → Controller → Model → Database
     */
    test("Should register new user through HTTP endpoint", async () => {
        // ARRANGE - Prepare test data
        const newUser = {
            name: "Test User Integration",
            email: "test123@integration.com",
            password: "password123"
        };

        // ACT - Make HTTP request to registration endpoint
        const response = await request(app)
            .post("/auth/register")
            .send(newUser);

        // ASSERT - Check response
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("user");
        expect(response.body.user.email).toBe(newUser.email);
    });

    /**
     * Test: Login flow integration
     * Tests: Route → Auth Controller → User Model → JWT Generation
     */
    test("Should login existing user", async () => {
        // ARRANGE - User already created in previous test
        const credentials = {
            email: "test123@integration.com",
            password: "password123"
        };

        // ACT - Make login request
        const response = await request(app)
            .post("/auth/login")
            .send(credentials);

        // ASSERT
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
    });
});

/**
 * Key Concepts Demonstrated:
 * 1. Integration Testing - Multiple components tested together
 * 2. HTTP Testing - Real requests to API endpoints
 * 3. Setup/Teardown - beforeAll and afterAll hooks
 * 4. Asynchronous Testing - Using async/await
 */
