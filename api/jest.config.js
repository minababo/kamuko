/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: "node",
    testMatch: ["**/tests/**/*.test.js"],
    collectCoverageFrom: ["src/**/*.js"],
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov"],
    verbose: true,
    testTimeout: 10000,
};
