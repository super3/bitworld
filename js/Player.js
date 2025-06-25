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
    constructor(firstName, lastName, x, y, spriteKey, floorIndex = 0) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.x = x;
        this.y = y;
        this.facingRight = true;  // Direction player is facing
        this.speed = GameConfig.CHAR_SPEED;
        this.isWalking = false;  // Current movement state
        
        this.spriteKey = spriteKey;
        this.currentFloor = floorIndex;
        this.vx = 0;
        this.targetX = null;
        this.defferedTargetX = null;
        this.waitingForElevator = false;
        this.targetFloor = null;
        this.inElevator = false;
        this.walkingThroughDoor = false;
        this.elevatorClickTimer  = null;
    }


    moveTowardTarget(dt) {
        if (this.targetX !== null) {
            const dx = this.targetX - this.x;
            const dir = Math.sign(dx);
            this.vx = dir * this.speed;
            this.x += this.vx * dt;
            this.isWalking = true;
            this.facingRight = dir > 0;

            if (Math.abs(dx) < 2) {
                this.x = this.targetX;
                this.stop();
            }
        } else {
            this.vx = 0;
            this.isWalking = false;
        }
    }

    stop() {
        this.vx = 0;
        this.targetX = null;
        this.isWalking = false;
    }
} 