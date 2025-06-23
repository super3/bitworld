/**
 * Tests for the GameConfig class
 */

const fs = require('fs');
const path = require('path');

// Load GameConfig class
const gameConfigCode = fs.readFileSync(path.join(__dirname, '../js/GameConfig.js'), 'utf8');
const gameConfigConstructor = new Function(gameConfigCode + '; return GameConfig;');
global.GameConfig = gameConfigConstructor();

describe('GameConfig', () => {
    describe('Display settings', () => {
        test('should have correct window dimensions', () => {
            expect(GameConfig.WINDOW_WIDTH).toBe(800);
            expect(GameConfig.WINDOW_HEIGHT).toBe(600);
            expect(GameConfig.TEXT_BOX_WIDTH).toBe(200);
        });

        test('should calculate total width correctly', () => {
            const expectedTotal = GameConfig.WINDOW_WIDTH + GameConfig.TEXT_BOX_WIDTH;
            expect(GameConfig.TOTAL_WIDTH).toBe(expectedTotal);
            expect(GameConfig.TOTAL_WIDTH).toBe(1000);
        });
    });

    describe('Color definitions', () => {
        test('should have valid hex color values', () => {
            expect(GameConfig.BACKGROUND_COLOR).toBe(0x8ed2ff);
            expect(GameConfig.GROUND_COLOR).toBe(0xa9574c);
            expect(GameConfig.GRASS_COLOR).toBe(0x30976c);
            expect(GameConfig.TEXT_BOX_COLOR).toBe(0xc8c8c8);
            expect(GameConfig.TEXT_COLOR).toBe(0x000000);
        });

        test('should have colors as numbers', () => {
            expect(typeof GameConfig.BACKGROUND_COLOR).toBe('number');
            expect(typeof GameConfig.GROUND_COLOR).toBe('number');
            expect(typeof GameConfig.GRASS_COLOR).toBe('number');
        });
    });

    describe('Character sprite settings', () => {
        test('should have correct sprite dimensions', () => {
            expect(GameConfig.SPRITE_WIDTH).toBe(32);
            expect(GameConfig.SPRITE_HEIGHT).toBe(32);
            expect(GameConfig.SCALE_FACTOR).toBe(2);
        });

        test('should have reasonable character speed', () => {
            expect(GameConfig.CHAR_SPEED).toBe(100);
            expect(GameConfig.CHAR_SPEED).toBeGreaterThan(0);
        });
    });

    describe('Animation settings', () => {
        test('should have valid animation speeds', () => {
            expect(GameConfig.IDLE_ANIMATION_SPEED).toBe(3);
            expect(GameConfig.WALK_ANIMATION_SPEED).toBe(8);
            expect(GameConfig.WALK_ANIMATION_SPEED).toBeGreaterThan(GameConfig.IDLE_ANIMATION_SPEED);
        });

        test('should have valid frame configurations', () => {
            expect(GameConfig.WALK_FRAMES).toEqual({ start: 0, end: 3 });
            expect(GameConfig.IDLE_FRAMES).toEqual({ start: 5, end: 7 });
            
            expect(GameConfig.WALK_FRAMES.start).toBeLessThan(GameConfig.WALK_FRAMES.end);
            expect(GameConfig.IDLE_FRAMES.start).toBeLessThan(GameConfig.IDLE_FRAMES.end);
        });
    });

    describe('Environment dimensions', () => {
        test('should have valid ground and grass heights', () => {
            expect(GameConfig.GROUND_HEIGHT).toBe(13);
            expect(GameConfig.GRASS_HEIGHT).toBe(2);
            expect(GameConfig.GROUND_HEIGHT).toBeGreaterThan(GameConfig.GRASS_HEIGHT);
        });
    });

    describe('Building settings', () => {
        test('should have valid building dimensions', () => {
            expect(GameConfig.BUILDING_WIDTH).toBe(288);
            expect(GameConfig.BUILDING_HEIGHT).toBe(48);
            expect(GameConfig.BUILDING_SCALE).toBe(2);
        });
    });

    describe('Sidebar settings', () => {
        test('should have valid sidebar configuration', () => {
            expect(GameConfig.SIDEBAR_BORDER_WIDTH).toBe(4);
            expect(GameConfig.SIDEBAR_BORDER_COLOR).toBe(0x2c3e50);
            expect(GameConfig.SIDEBAR_MARGIN).toBe(GameConfig.WINDOW_WIDTH + 20);
        });

        test('should have valid sidebar positions', () => {
            expect(GameConfig.SIDEBAR_PLAYER_Y).toBe(30);
            expect(GameConfig.SIDEBAR_CONTROLS_Y).toBe(80);
            expect(GameConfig.SIDEBAR_KEY_A_Y).toBe(120);
            expect(GameConfig.SIDEBAR_KEY_D_Y).toBe(155);
        });

        test('should have valid text styles', () => {
            expect(GameConfig.SIDEBAR_PLAYER_STYLE).toEqual({
                fontSize: '18px',
                fill: '#000000',
                fontFamily: 'monospace',
                fontWeight: 'bold'
            });

            expect(GameConfig.SIDEBAR_HEADER_STYLE).toEqual({
                fontSize: '14px',
                fill: '#000000',
                fontFamily: 'monospace'
            });
        });
    });

    describe('Sidebar key configuration', () => {
        test('should have complete key configuration object', () => {
            const keyConfig = GameConfig.SIDEBAR_KEY_CONFIG;
            
            expect(keyConfig.x).toBe(GameConfig.WINDOW_WIDTH + 30);
            expect(keyConfig.size).toBe(20);
            expect(keyConfig.borderWidth).toBe(4);
            expect(keyConfig.borderColor).toBe(0x000000);
            expect(keyConfig.bgColor).toBe(0xffffff);
            expect(keyConfig.textOffset).toBe(6);
            expect(keyConfig.labelOffset).toBe(25);
        });

        test('should have valid key text and label styles', () => {
            const keyConfig = GameConfig.SIDEBAR_KEY_CONFIG;
            
            expect(keyConfig.textStyle).toEqual({
                fontSize: '14px',
                fill: '#000000',
                fontFamily: 'monospace',
                fontWeight: 'bold'
            });

            expect(keyConfig.labelStyle).toEqual({
                fontSize: '12px',
                fill: '#000000',
                fontFamily: 'monospace'
            });
        });
    });

    describe('Static properties validation', () => {
        test('should have all properties as static', () => {
            // Test that properties are accessible without instantiation
            expect(() => GameConfig.WINDOW_WIDTH).not.toThrow();
            expect(() => GameConfig.CHAR_SPEED).not.toThrow();
        });

        test('should have consistent UI scaling', () => {
            expect(GameConfig.FONT_SIZE).toBe(20);
            expect(GameConfig.FONT_SIZE).toBeGreaterThan(0);
        });
    });
}); 