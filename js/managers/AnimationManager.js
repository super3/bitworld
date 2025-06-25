/**
 * Animation manager for creating and configuring sprite animations
 */
class AnimationManager {
    static createAnimations(scene, spriteKey) {
        // Create walk animation
        scene.anims.create({
            key: `walk_${spriteKey}`,
            frames: scene.anims.generateFrameNumbers(spriteKey, GameConfig.WALK_FRAMES),
            frameRate: GameConfig.WALK_ANIMATION_SPEED,
            repeat: -1
        });
        
        // Create idle animation
        scene.anims.create({
            key: `idle_${spriteKey}`,
            frames: scene.anims.generateFrameNumbers(spriteKey, GameConfig.IDLE_FRAMES),
            frameRate: GameConfig.IDLE_ANIMATION_SPEED,
            repeat: -1
        });
    }
}
