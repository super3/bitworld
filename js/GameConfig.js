/**
 * Static configuration class that holds all game constants and settings.
 * This centralized approach makes it easier to modify game parameters.
 */
class GameConfig {
    // Display settings
    static WINDOW_WIDTH = 800;  // Width of the main game window
    static WINDOW_HEIGHT = 600;  // Height of the main game window
    static TEXT_BOX_WIDTH = 200;  // Width of the side panel text box
    static TOTAL_WIDTH = GameConfig.WINDOW_WIDTH + GameConfig.TEXT_BOX_WIDTH;  // Total window width including text box
    
    // Color definitions in hex format
    static BACKGROUND_COLOR = 0x8ed2ff;  // Light blue sky
    static GROUND_COLOR = 0xa9574c;  // Brown earth
    static GRASS_COLOR = 0x30976c;  // Green grass
    static TEXT_BOX_COLOR = 0xc8c8c8;  // Light gray
    static TEXT_COLOR = 0x000000;  // Black text
    
    // Character sprite settings
    static SPRITE_WIDTH = 32;  // Width of a single sprite frame
    static SPRITE_HEIGHT = 32;  // Height of a single sprite frame
    static SCALE_FACTOR = 2;  // Scaling factor for sprites
    static CHAR_SPEED = 100;  // Character movement speed (pixels per second)
    
    // Animation timing settings
    static IDLE_ANIMATION_SPEED = 3;  // Frames per second when idle
    static WALK_ANIMATION_SPEED = 8;  // Frames per second when walking
    
    // Environment dimensions
    static GROUND_HEIGHT = 13;  // Height of the ground layer
    static GRASS_HEIGHT = 2;  // Height of the grass layer
    
    // UI settings
    static FONT_SIZE = 20;  // Size of the font in pixels
    
    // Building settings
    static BUILDING_WIDTH = 288;  // Original width of building sprites
    static BUILDING_HEIGHT = 48;  // Original height of building sprites
    static BUILDING_SCALE = 2;  // Scale factor for building sprites
} 