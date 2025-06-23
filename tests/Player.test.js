/**
 * Tests for the Player class
 */

// Import the classes by loading them as strings and evaluating in global scope
const fs = require('fs');
const path = require('path');

// Load GameConfig class
const gameConfigCode = fs.readFileSync(path.join(__dirname, '../js/GameConfig.js'), 'utf8');
const gameConfigConstructor = new Function(gameConfigCode + '; return GameConfig;');
global.GameConfig = gameConfigConstructor();

// Load Player class  
const playerCode = fs.readFileSync(path.join(__dirname, '../js/Player.js'), 'utf8');
const playerConstructor = new Function('GameConfig', playerCode + '; return Player;');
global.Player = playerConstructor(global.GameConfig);

describe('Player', () => {
    let player;

    beforeEach(() => {
        player = new Player('John', 'Doe', 100, 200);
    });

    describe('constructor', () => {
        test('should initialize with correct properties', () => {
            expect(player.firstName).toBe('John');
            expect(player.lastName).toBe('Doe');
            expect(player.x).toBe(100);
            expect(player.y).toBe(200);
            expect(player.facingRight).toBe(true);
            expect(player.speed).toBe(GameConfig.CHAR_SPEED);
            expect(player.isWalking).toBe(false);
        });

        test('should handle different names', () => {
            const testPlayer = new Player('Jane', 'Smith', 50, 150);
            expect(testPlayer.firstName).toBe('Jane');
            expect(testPlayer.lastName).toBe('Smith');
        });

        test('should handle different positions', () => {
            const testPlayer = new Player('Test', 'User', 0, 0);
            expect(testPlayer.x).toBe(0);
            expect(testPlayer.y).toBe(0);
        });
    });

    describe('move', () => {
        test('should move right correctly', () => {
            const initialX = player.x;
            const deltaTime = 0.016; // ~60fps
            const direction = 1;

            player.move(direction, deltaTime);

            expect(player.x).toBeGreaterThan(initialX);
            expect(player.facingRight).toBe(true);
            expect(player.isWalking).toBe(true);
        });

        test('should move left correctly', () => {
            const initialX = player.x;
            const deltaTime = 0.016;
            const direction = -1;

            player.move(direction, deltaTime);

            expect(player.x).toBeLessThan(initialX);
            expect(player.facingRight).toBe(false);
            expect(player.isWalking).toBe(true);
        });

        test('should calculate movement distance correctly', () => {
            const initialX = player.x;
            const deltaTime = 0.1; // 100ms
            const direction = 1;
            const expectedDistance = GameConfig.CHAR_SPEED * deltaTime;

            player.move(direction, deltaTime);

            expect(player.x).toBeCloseTo(initialX + expectedDistance);
        });

        test('should handle zero delta time', () => {
            const initialX = player.x;
            player.move(1, 0);

            expect(player.x).toBe(initialX);
            expect(player.isWalking).toBe(true);
        });

        test('should handle large delta time', () => {
            const initialX = player.x;
            const deltaTime = 1; // 1 second
            const direction = 1;

            player.move(direction, deltaTime);

            expect(player.x).toBe(initialX + GameConfig.CHAR_SPEED);
        });
    });

    describe('stopWalking', () => {
        test('should stop walking when called', () => {
            // First start walking
            player.move(1, 0.016);
            expect(player.isWalking).toBe(true);

            // Then stop
            player.stopWalking();
            expect(player.isWalking).toBe(false);
        });

        test('should not affect position when stopping', () => {
            const initialX = player.x;
            const initialY = player.y;

            player.stopWalking();

            expect(player.x).toBe(initialX);
            expect(player.y).toBe(initialY);
        });

        test('should not affect facing direction when stopping', () => {
            player.move(-1, 0.016); // Move left
            expect(player.facingRight).toBe(false);

            player.stopWalking();
            expect(player.facingRight).toBe(false);
        });
    });

    describe('state management', () => {
        test('should maintain facing direction between moves', () => {
            player.move(-1, 0.016);
            expect(player.facingRight).toBe(false);

            player.stopWalking();
            player.move(-1, 0.016);
            expect(player.facingRight).toBe(false);
        });

        test('should change facing direction when moving opposite way', () => {
            player.move(-1, 0.016);
            expect(player.facingRight).toBe(false);

            player.move(1, 0.016);
            expect(player.facingRight).toBe(true);
        });
    });
}); 