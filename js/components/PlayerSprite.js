/**
 * Player sprite component for handling visual representation and animations
 */
class PlayerSprite {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.sprite = null;
        this.create();
    }

    create() {
        this.sprite = this.scene.add.sprite(this.player.x, this.player.y, 'npc1');
        this.sprite.setScale(GameConfig.SCALE_FACTOR);
        this.sprite.setOrigin(0.5, 1); // Center-bottom origin for proper ground positioning
    }

    update() {
        this.updatePosition();
        this.updateDirection();
        this.updateAnimation();
    }

    updatePosition() {
        this.sprite.setPosition(this.player.x, this.player.y);
    }

    updateDirection() {
        this.sprite.setFlipX(!this.player.facingRight);
    }

    updateAnimation() {
        if (this.player.isWalking) {
            if (this.sprite.anims.currentAnim?.key !== 'walk') {
                this.sprite.play('walk');
            }
        } else {
            if (this.sprite.anims.currentAnim?.key !== 'idle') {
                this.sprite.play('idle');
            }
        }
    }

    destroy() {
        if (this.sprite) {
            this.sprite.destroy();
            this.sprite = null;
        }
    }
} 