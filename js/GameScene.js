/**
 * Main game scene class that handles initialization, game loop, and rendering.
 * Coordinates all game systems and manages the main update loop.
 */
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Load character sprite sheet
        this.load.spritesheet('npc1', 'NPC/Male/NPC 1.png', {
            frameWidth: GameConfig.SPRITE_WIDTH,
            frameHeight: GameConfig.SPRITE_HEIGHT
        });

        // Load building sprites
        this.load.image('lobby', 'World/apartment_lobby.png');
        this.load.image('design1', 'World/apartment_design1.png');
        this.load.image('design2', 'World/apartment_design2.png');
        this.load.image('design3', 'World/apartment_design3.png');
        this.load.image('roof', 'World/apartment_roof.png');
    }

    create() {
        // Create background
        this.add.rectangle(
            GameConfig.WINDOW_WIDTH / 2, 
            GameConfig.WINDOW_HEIGHT / 2, 
            GameConfig.WINDOW_WIDTH, 
            GameConfig.WINDOW_HEIGHT, 
            GameConfig.BACKGROUND_COLOR
        );

        // Create ground
        this.add.rectangle(
            GameConfig.WINDOW_WIDTH / 2,
            GameConfig.WINDOW_HEIGHT - GameConfig.GROUND_HEIGHT / 2,
            GameConfig.WINDOW_WIDTH,
            GameConfig.GROUND_HEIGHT,
            GameConfig.GROUND_COLOR
        );

        // Create grass
        this.add.rectangle(
            GameConfig.WINDOW_WIDTH / 2,
            GameConfig.WINDOW_HEIGHT - GameConfig.GROUND_HEIGHT - GameConfig.GRASS_HEIGHT / 2,
            GameConfig.WINDOW_WIDTH,
            GameConfig.GRASS_HEIGHT,
            GameConfig.GRASS_COLOR
        );

        // Create building sprites
        this.createBuilding();

        // Initialize player
        // Match the Python calculation exactly: WINDOW_HEIGHT - GROUND_HEIGHT - (SPRITE_HEIGHT * SCALE_FACTOR) + 15
        // In Python this positions the sprite by top-left, but we're using bottom-center origin
        // So we need to adjust for the difference in positioning systems
        const pythonY = GameConfig.WINDOW_HEIGHT - GameConfig.GROUND_HEIGHT - (GameConfig.SPRITE_HEIGHT * GameConfig.SCALE_FACTOR) + 15;
        // Python: 600 - 13 - (32 * 2) + 15 = 600 - 13 - 64 + 15 = 538
        // Since Python positioned by top-left and we position by bottom-center, add sprite height
        const playerY = pythonY + (GameConfig.SPRITE_HEIGHT * GameConfig.SCALE_FACTOR);
        
        this.player = new Player(
            "John", "Sim",
            GameConfig.WINDOW_WIDTH / 2,
            playerY
        );

        // Create player sprite
        this.playerSprite = this.add.sprite(this.player.x, this.player.y, 'npc1');
        this.playerSprite.setScale(GameConfig.SCALE_FACTOR);
        // Set origin to center-bottom so sprite stands on the ground properly
        this.playerSprite.setOrigin(0.5, 1);

        // Create animations
        this.createAnimations();

        // Set up input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');

        // Create text box
        this.createTextBox();

        // Animation state
        this.currentFrame = 0;
        this.animationTimer = 0;
    }

    createBuilding() {
        const floorSprites = ['lobby', 'design1', 'design2', 'design3'];
        const scaledWidth = GameConfig.BUILDING_WIDTH * GameConfig.BUILDING_SCALE;
        const scaledHeight = GameConfig.BUILDING_HEIGHT * GameConfig.BUILDING_SCALE;
        
        // Calculate building x position (centered)
        const buildingX = GameConfig.WINDOW_WIDTH / 2;

        // Create building floors from bottom to top (excluding roof)
        floorSprites.forEach((spriteName, index) => {
            const yPos = GameConfig.WINDOW_HEIGHT - GameConfig.GROUND_HEIGHT - scaledHeight * (index + 1) + scaledHeight / 2;
            const buildingFloor = this.add.image(buildingX, yPos, spriteName);
            buildingFloor.setScale(GameConfig.BUILDING_SCALE);
        });

        // Position roof directly on top of the highest floor (design3)
        // Top floor center is at: WINDOW_HEIGHT - GROUND_HEIGHT - scaledHeight * 4 + scaledHeight / 2
        // Top floor top edge is at: topFloorCenter - scaledHeight / 2 = WINDOW_HEIGHT - GROUND_HEIGHT - scaledHeight * 4
        // Roof center should be at: topFloorTopEdge - scaledHeight / 2, but move it down a bit to close the gap
        const roofY = GameConfig.WINDOW_HEIGHT - GameConfig.GROUND_HEIGHT - scaledHeight * 4.3;
        const roof = this.add.image(buildingX, roofY, 'roof');
        roof.setScale(GameConfig.BUILDING_SCALE);
    }

    createAnimations() {
        // Let's try being very conservative with frame ranges
        // Use only frames that we're certain don't contain text
        
        // Now I understand! Sprite sheet is 5×3 (5 columns, 3 rows)
        // Row 0: frames 0-4, Row 1: frames 5-9, Row 2: frames 10-14
        
        // Create walk animation - row 0, frames 0-3 (avoid frame 4 which has "move" text)
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('npc1', { 
                start: 0, // Row 0, frame 0
                end: 3    // Row 0, frame 3 (4 frames total, skipping frame 4)
            }),
            frameRate: GameConfig.WALK_ANIMATION_SPEED,
            repeat: -1
        });

        // Create idle animation - row 1, frames 5-7 (3 frames as in Python)
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('npc1', { 
                start: 5, // Row 1, frame 0
                end: 7   // Row 1, frame 2 (3 frames total)
            }),
            frameRate: GameConfig.IDLE_ANIMATION_SPEED,
            repeat: -1
        });
    }

    createTextBox() {
        // Create text box background
        this.textBoxBg = this.add.rectangle(
            GameConfig.WINDOW_WIDTH + GameConfig.TEXT_BOX_WIDTH / 2,
            GameConfig.WINDOW_HEIGHT / 2,
            GameConfig.TEXT_BOX_WIDTH,
            GameConfig.WINDOW_HEIGHT,
            GameConfig.TEXT_BOX_COLOR
        );

        // Create text elements
        const textLines = [
            `Name: ${this.player.firstName} ${this.player.lastName}`,
            "",
            "Controls:",
            "A/D - Move left/right",
            "Esc - Quit"
        ];

        this.textElements = [];
        textLines.forEach((line, index) => {
            const textObj = this.add.text(
                GameConfig.WINDOW_WIDTH + 10,
                10 + index * (GameConfig.FONT_SIZE + 5),
                line,
                {
                    fontSize: `${GameConfig.FONT_SIZE}px`,
                    fill: '#000000'
                }
            );
            this.textElements.push(textObj);
        });
    }

    update(time, delta) {
        this.handleInput(delta / 1000); // Convert to seconds
        this.updatePlayerSprite();
    }

    handleInput(dt) {
        this.player.stopWalking();

        // Handle movement
        if (this.wasd.A.isDown) {
            this.player.move(-1, dt);
        } else if (this.wasd.D.isDown) {
            this.player.move(1, dt);
        }

        // Keep player within bounds
        this.player.x = Phaser.Math.Clamp(
            this.player.x, 
            0, 
            GameConfig.WINDOW_WIDTH - (GameConfig.SPRITE_WIDTH * GameConfig.SCALE_FACTOR)
        );
    }

    updatePlayerSprite() {
        // Update sprite position
        this.playerSprite.setPosition(this.player.x, this.player.y);

        // Update sprite direction
        this.playerSprite.setFlipX(!this.player.facingRight);

        // Update animation
        if (this.player.isWalking) {
            if (this.playerSprite.anims.currentAnim?.key !== 'walk') {
                this.playerSprite.play('walk');
            }
        } else {
            if (this.playerSprite.anims.currentAnim?.key !== 'idle') {
                this.playerSprite.play('idle');
            }
        }
    }
} 