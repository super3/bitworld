/**
 * Input manager for handling pointer input and player movement
 */
class InputManager {
    constructor(scene) {
        this.scene = scene;

        // Left click = move selected player
        this.scene.input.on('pointerdown', pointer => {
            if (pointer.rightButtonDown()) return; // handled elsewhere for selection

            const selected = this.scene.selectedPlayer;
            
            if (this.scene.elevatorManager.isLocked && this.scene.elevatorManager.boardedPlayers.includes(selected)) return;
            
            if (selected) {
                selected.targetX = pointer.worldX;
                selected.walkingThroughDoor = false;
            }
        });
    }

    update(dt) {
        const selected = this.scene.selectedPlayer;
        if (selected) {
            // Apply constraints
            selected.x = Phaser.Math.Clamp(
                selected.x,
                0,
                GameConfig.WINDOW_WIDTH - (GameConfig.SPRITE_WIDTH * GameConfig.SCALE_FACTOR)
            );
        }
    }

    destroy() {
        // Clean up if needed later
    }
}
