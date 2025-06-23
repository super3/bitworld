/**
 * Tests for the AnimationManager class
 */

const fs = require('fs');
const path = require('path');

// Load GameConfig class
const gameConfigCode = fs.readFileSync(path.join(__dirname, '../js/GameConfig.js'), 'utf8');
const gameConfigConstructor = new Function(gameConfigCode + '; return GameConfig;');
global.GameConfig = gameConfigConstructor();

// Load AnimationManager class
const animationManagerCode = fs.readFileSync(path.join(__dirname, '../js/managers/AnimationManager.js'), 'utf8');
const animationManagerConstructor = new Function('GameConfig', animationManagerCode + '; return AnimationManager;');
global.AnimationManager = animationManagerConstructor(global.GameConfig);

describe('AnimationManager', () => {
    let mockScene;

    beforeEach(() => {
        // Mock scene with animations API
        mockScene = {
            anims: {
                create: jest.fn(),
                generateFrameNumbers: jest.fn()
            }
        };

        // Reset mocks
        jest.clearAllMocks();
    });

    describe('createAnimations', () => {
        test('should be a static method', () => {
            expect(typeof AnimationManager.createAnimations).toBe('function');
        });

        test('should create walk animation', () => {
            mockScene.anims.generateFrameNumbers.mockReturnValue([0, 1, 2, 3]);
            
            AnimationManager.createAnimations(mockScene);

            expect(mockScene.anims.generateFrameNumbers).toHaveBeenCalledWith('npc1', GameConfig.WALK_FRAMES);
            expect(mockScene.anims.create).toHaveBeenCalledWith({
                key: 'walk',
                frames: [0, 1, 2, 3],
                frameRate: GameConfig.WALK_ANIMATION_SPEED,
                repeat: -1
            });
        });

        test('should create idle animation', () => {
            mockScene.anims.generateFrameNumbers.mockReturnValue([5, 6, 7]);
            
            AnimationManager.createAnimations(mockScene);

            expect(mockScene.anims.generateFrameNumbers).toHaveBeenCalledWith('npc1', GameConfig.IDLE_FRAMES);
            expect(mockScene.anims.create).toHaveBeenCalledWith({
                key: 'idle',
                frames: [5, 6, 7],
                frameRate: GameConfig.IDLE_ANIMATION_SPEED,
                repeat: -1
            });
        });

        test('should create both animations when called', () => {
            mockScene.anims.generateFrameNumbers
                .mockReturnValueOnce([0, 1, 2, 3])  // Walk frames
                .mockReturnValueOnce([5, 6, 7]);    // Idle frames
            
            AnimationManager.createAnimations(mockScene);

            expect(mockScene.anims.create).toHaveBeenCalledTimes(2);
            
            // Check that both animations were created
            const createCalls = mockScene.anims.create.mock.calls;
            const animationKeys = createCalls.map(call => call[0].key);
            expect(animationKeys).toContain('walk');
            expect(animationKeys).toContain('idle');
        });

        test('should use correct frame rates for animations', () => {
            mockScene.anims.generateFrameNumbers
                .mockReturnValueOnce([0, 1, 2, 3])
                .mockReturnValueOnce([5, 6, 7]);
            
            AnimationManager.createAnimations(mockScene);

            const createCalls = mockScene.anims.create.mock.calls;
            
            // Find walk animation call
            const walkCall = createCalls.find(call => call[0].key === 'walk');
            expect(walkCall[0].frameRate).toBe(GameConfig.WALK_ANIMATION_SPEED);
            
            // Find idle animation call
            const idleCall = createCalls.find(call => call[0].key === 'idle');
            expect(idleCall[0].frameRate).toBe(GameConfig.IDLE_ANIMATION_SPEED);
        });

        test('should set animations to repeat infinitely', () => {
            mockScene.anims.generateFrameNumbers
                .mockReturnValueOnce([0, 1, 2, 3])
                .mockReturnValueOnce([5, 6, 7]);
            
            AnimationManager.createAnimations(mockScene);

            const createCalls = mockScene.anims.create.mock.calls;
            
            createCalls.forEach(call => {
                expect(call[0].repeat).toBe(-1);
            });
        });

        test('should handle scene without animations API gracefully', () => {
            const badScene = {};
            
            expect(() => {
                AnimationManager.createAnimations(badScene);
            }).toThrow();
        });

        test('should use npc1 as sprite key for both animations', () => {
            AnimationManager.createAnimations(mockScene);

            const generateFrameNumbersCalls = mockScene.anims.generateFrameNumbers.mock.calls;
            
            generateFrameNumbersCalls.forEach(call => {
                expect(call[0]).toBe('npc1');
            });
        });
    });

    describe('class structure', () => {
        test('should be a class with static methods only', () => {
            expect(typeof AnimationManager).toBe('function');
            expect(AnimationManager.createAnimations).toBeDefined();
        });

        test('should not be intended for instantiation', () => {
            // The class doesn't have a constructor, so this tests the static nature
            const instance = new AnimationManager();
            expect(instance).toBeDefined();
            expect(instance.createAnimations).toBeUndefined(); // Instance shouldn't have the static method
        });
    });
}); 