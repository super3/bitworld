/**
 * Input manager for handling keyboard input and player movement
 */
class InputManager {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.keys = scene.input.keyboard.addKeys('A,D');
    }

    update(dt) {
        this.player.stopWalking();

        if (this.keys.A.isDown) {
            this.player.move(-1, dt);
        } else if (this.keys.D.isDown) {
            this.player.move(1, dt);
        }

        this.constrainPlayer();
    }

    constrainPlayer() {
        this.player.x = Phaser.Math.Clamp(
            this.player.x, 
            0, 
            GameConfig.WINDOW_WIDTH - (GameConfig.SPRITE_WIDTH * GameConfig.SCALE_FACTOR)
        );
    }

    destroy() {
        // Clean up if needed
        this.keys = null;
    }
} 