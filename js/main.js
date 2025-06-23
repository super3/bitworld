/**
 * Main game initialization and configuration
 */

// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: GameConfig.TOTAL_WIDTH,
    height: GameConfig.WINDOW_HEIGHT,
    parent: 'game-container',
    backgroundColor: GameConfig.BACKGROUND_COLOR,
    scene: GameScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    render: {
        pixelArt: true,           // Enable pixel-perfect rendering
        antialias: false,         // Disable anti-aliasing
        roundPixels: true         // Round positions to nearest pixel
    }
};

// Initialize the game
const game = new Phaser.Game(config); 