const sinon = require("sinon");

/**
 * TEST 3: MOCK OBJECTS
 * 
 * Lecture Topic: Mock Objects
 * - Use mock objects when real object is difficult to set up
 * - Control non-deterministic behaviour
 * - Test in isolation without external dependencies
 * 
 * This demonstrates:
 * - Sinon spies to inspect function calls
 * - Mocking request/response objects
 * - Testing without actual HTTP server
 */

// Simple controller to test
const orderController = {
    getOrderById: function (req, res) {
        // Simulated controller logic
        const orderId = req.params.id;
        res.status(200).json({ orderId, status: "pending" });
    },

    createOrder: function (req, res) {
        const order = {
            items: req.body.items || [],
            createdAt: new Date(),
            userId: req.user.id
        };
        res.status(201).json(order);
    }
};

describe("Mock Objects - Order Controller", () => {

    /**
     * Test: Using Sinon Spy to inspect function calls
     * From lecture: "Inspect the calling of functions"
     */
    test("Should call response.json when getting order", () => {
        // ARRANGE - Create mock request and response objects
        const request = {
            params: { id: "12345" },
            user: { id: "user123" }
        };

        const response = {
            status: sinon.stub().returnsThis(), // Returns itself for chaining
            json: sinon.spy() // Spy to check if called
        };

        // ACT - Call the controller function with mocks
        orderController.getOrderById(request, response);

        // ASSERT - Check that response.json was called
        expect(response.json.calledOnce).toBe(true);
        expect(response.status.calledWith(200)).toBe(true);
    });

    /**
     * Test: Using Sinon Fake Timers
     * From lecture: "Control the system time for time/date specific tests"
     */
    test("Should use current date for order timestamp", () => {
        // ARRANGE - Set a specific date/time
        const fakeDate = new Date(2024, 0, 15, 10, 30, 0); // Jan 15, 2024, 10:30 AM
        const clock = sinon.useFakeTimers(fakeDate);

        const request = {
            body: { items: ["item1", "item2"] },
            user: { id: "user123" }
        };

        const response = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        // ACT - Create order (will use mocked time)
        orderController.createOrder(request, response);

        // ASSERT - Verify response and timestamp
        expect(response.json.calledOnce).toBe(true);
        const callArgs = response.json.firstCall.args[0];
        expect(callArgs.createdAt.getTime()).toBe(fakeDate.getTime());

        // CLEANUP - Restore real time
        clock.restore();
    });

    /**
     * Test: Mocking database calls
     * Shows isolation from external dependencies
     */
    test("Should handle errors gracefully with mock", () => {
        // ARRANGE - Mock function that throws error
        const mockDbCall = sinon.stub().throws(new Error("Database connection failed"));

        const request = { params: { id: "123" } };
        const response = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        // ACT - Simulate error handling
        try {
            mockDbCall(); // Would normally be a real database call
        } catch (error) {
            response.status(500).json({ error: error.message });
        }

        // ASSERT - Check error was handled
        expect(response.status.calledWith(500)).toBe(true);
        expect(response.json.calledOnce).toBe(true);

        const errorResponse = response.json.firstCall.args[0];
        expect(errorResponse.error).toBe("Database connection failed");
    });
});

/**
 * Key Concepts Demonstrated:
 * 1. Mock Objects - Replacing real objects for testing
 * 2. Sinon Spies - Inspecting function calls
 * 3. Sinon Fake Timers - Controlling system time
 * 4. Isolation - Testing without external dependencies
 * 5. Stub Objects - Simulating behaviour
 */