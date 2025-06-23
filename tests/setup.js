/**
 * Jest setup file for simworld tests
 * Mocks Phaser.js and sets up global test environment
 */

// Mock Phaser globally
global.Phaser = {
    Math: {
        Clamp: jest.fn((value, min, max) => Math.min(Math.max(value, min), max))
    },
    AUTO: 'AUTO',
    Scale: {
        NONE: 'NONE',
        CENTER_BOTH: 'CENTER_BOTH'
    },
    Game: jest.fn()
};

// GameConfig will be loaded by individual test files

// Mock console methods for cleaner test output
global.console = {
    ...console,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
}; 