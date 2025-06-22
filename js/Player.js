/**
 * Player class representing the game character.
 * Handles player state, movement, and attributes.
 */
class Player {
    /**
     * Initialize a new player character.
     * 
     * @param {string} firstName - Player's first name
     * @param {string} lastName - Player's last name
     * @param {number} x - Initial x position
     * @param {number} y - Initial y position
     */
    constructor(firstName, lastName, x, y) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.x = x;
        this.y = y;
        this.facingRight = true;  // Direction player is facing
        this.speed = GameConfig.CHAR_SPEED;
        this.isWalking = false;  // Current movement state
    }

    /**
     * Move the player in the specified direction.
     * 
     * @param {number} direction - -1 for left, 1 for right
     * @param {number} dt - Delta time for frame-independent movement
     */
    move(direction, dt) {
        this.isWalking = true;
        this.facingRight = (direction > 0);
        this.x += direction * this.speed * dt;
    }

    /**
     * Stop the player movement
     */
    stopWalking() {
        this.isWalking = false;
    }
} 