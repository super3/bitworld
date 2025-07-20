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
        this.deferredTargetX = null;
        this.waitingForElevator = false;
        this.targetFloor = null;
        this.inElevator = false;
        this.walkingThroughDoor = false;
        this.elevatorClickTimer  = null;
        
        // Status attributes (0-100 scale)
        this.thirst = 100;  // 100 = fully hydrated, 0 = extremely thirsty
        this.hunger = 100;  // 100 = full, 0 = starving
        this.sleep = 100;   // 100 = well-rested, 0 = exhausted
        this.toilet = 100;  // 100 = no need, 0 = urgent need
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
    
    /**
     * Update player status values over time
     * @param {number} dt - Delta time in seconds
     */
    updateStatus(dt) {
        // Status degradation rates per second
        const THIRST_RATE = 0.5;  // Lose 0.5% thirst per second
        const HUNGER_RATE = 0.3;  // Lose 0.3% hunger per second  
        const SLEEP_RATE = 0.2;   // Lose 0.2% sleep per second
        const TOILET_RATE = 0.4;  // Lose 0.4% toilet per second
        
        // Update status values
        this.thirst = Math.max(0, this.thirst - (THIRST_RATE * dt));
        this.hunger = Math.max(0, this.hunger - (HUNGER_RATE * dt));
        this.sleep = Math.max(0, this.sleep - (SLEEP_RATE * dt));
        this.toilet = Math.max(0, this.toilet - (TOILET_RATE * dt));
    }
} 