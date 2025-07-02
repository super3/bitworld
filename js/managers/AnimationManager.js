/**
 * Animation manager for creating and configuring sprite animations
 */
class AnimationManager {
    static createAnimations(scene, spriteKey) {
        // Check if animations already exist to avoid duplicates
        const walkKey = `walk_${spriteKey}`;
        const idleKey = `idle_${spriteKey}`;
        
        // Create walk animation only if it doesn't exist
        if (!scene.anims.exists(walkKey)) {
            scene.anims.create({
                key: walkKey,
                frames: scene.anims.generateFrameNumbers(spriteKey, GameConfig.WALK_FRAMES),
                frameRate: GameConfig.WALK_ANIMATION_SPEED,
                repeat: -1
            });
        }
        
        // Create idle animation only if it doesn't exist
        if (!scene.anims.exists(idleKey)) {
            scene.anims.create({
                key: idleKey,
                frames: scene.anims.generateFrameNumbers(spriteKey, GameConfig.IDLE_FRAMES),
                frameRate: GameConfig.IDLE_ANIMATION_SPEED,
                repeat: -1
            });
        }
    }
}
