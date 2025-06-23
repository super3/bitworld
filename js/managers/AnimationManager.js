/**
 * Animation manager for creating and configuring sprite animations
 */
class AnimationManager {
    static createAnimations(scene) {
        // Create walk animation
        scene.anims.create({
            key: 'walk',
            frames: scene.anims.generateFrameNumbers('npc1', GameConfig.WALK_FRAMES),
            frameRate: GameConfig.WALK_ANIMATION_SPEED,
            repeat: -1
        });

        // Create idle animation
        scene.anims.create({
            key: 'idle', 
            frames: scene.anims.generateFrameNumbers('npc1', GameConfig.IDLE_FRAMES),
            frameRate: GameConfig.IDLE_ANIMATION_SPEED,
            repeat: -1
        });
    }
} 