/**
 * Player sprite component for handling visual representation and animations
 */
class PlayerSprite {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.sprite = this.scene.add.sprite(player.x, player.y, player.spriteKey);
        this.sprite.setScale(GameConfig.SCALE_FACTOR);
        this.sprite.setOrigin(0.5, 1);
        this.sprite.setDepth(20); // ensure it's above elevator
        this.player.spriteRef = this.sprite;
    }

    update() {
        const sprite = this.sprite;
        sprite.setPosition(this.player.x, this.player.y);
        sprite.flipX = this.player.vx < 0;

        const walkKey = `walk_${this.player.spriteKey}`;
        const idleKey = `idle_${this.player.spriteKey}`;

        if (this.player.vx !== 0) {
            if (!sprite.anims.isPlaying || sprite.anims.currentAnim.key !== walkKey) {
                sprite.anims.play(walkKey, true);
            }
        } else {
            if (!sprite.anims.isPlaying || sprite.anims.currentAnim.key !== idleKey) {
                sprite.anims.play(idleKey, true);
            }
        }
    }

    destroy() {
        this.sprite.destroy();
    }
}
