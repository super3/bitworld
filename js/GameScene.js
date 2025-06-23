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
        this.createEnvironment();
        this.createPlayer();
        this.createUI();
        this.setupInput();
    }

    createEnvironment() {
        this.environmentManager = new EnvironmentManager(this);
        this.buildingManager = new BuildingManager(this);
    }

    createPlayer() {
        this.player = new Player(
            "John", "Sim", 
            GameConfig.WINDOW_WIDTH / 2, 
            this.calculatePlayerY()
        );
        this.playerSprite = new PlayerSprite(this, this.player);
        
        // Create animations
        AnimationManager.createAnimations(this);
    }

    createUI() {
        this.sidebar = new Sidebar(this, this.player);
    }

    setupInput() {
        this.inputManager = new InputManager(this, this.player);
    }

    calculatePlayerY() {
        // Match the Python calculation exactly and adjust for Phaser's coordinate system
        const pythonY = GameConfig.WINDOW_HEIGHT - GameConfig.GROUND_HEIGHT - 
                       (GameConfig.SPRITE_HEIGHT * GameConfig.SCALE_FACTOR) + 15;
        return pythonY + (GameConfig.SPRITE_HEIGHT * GameConfig.SCALE_FACTOR);
    }

    update(time, delta) {
        // Delegate to input manager
        this.inputManager.update(delta / 1000); // Convert to seconds
        
        // Update player sprite
        this.playerSprite.update();
        
        // Update sidebar position display
        this.sidebar.updatePosition(Math.floor(this.player.x), Math.floor(this.player.y));
    }
} 