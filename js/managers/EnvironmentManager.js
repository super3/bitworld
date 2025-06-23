/**
 * Environment manager for creating background elements like sky, ground, and grass
 */
class EnvironmentManager {
    constructor(scene) {
        this.scene = scene;
        this.elements = [];
        this.create();
    }

    create() {
        this.createBackground();
        this.createGround();
        this.createGrass();
    }

    createBackground() {
        const background = this.scene.add.rectangle(
            GameConfig.WINDOW_WIDTH / 2, 
            GameConfig.WINDOW_HEIGHT / 2, 
            GameConfig.WINDOW_WIDTH, 
            GameConfig.WINDOW_HEIGHT, 
            GameConfig.BACKGROUND_COLOR
        );
        this.elements.push(background);
    }

    createGround() {
        const ground = this.scene.add.rectangle(
            GameConfig.WINDOW_WIDTH / 2,
            GameConfig.WINDOW_HEIGHT - GameConfig.GROUND_HEIGHT / 2,
            GameConfig.WINDOW_WIDTH,
            GameConfig.GROUND_HEIGHT,
            GameConfig.GROUND_COLOR
        );
        this.elements.push(ground);
    }

    createGrass() {
        const grass = this.scene.add.rectangle(
            GameConfig.WINDOW_WIDTH / 2,
            GameConfig.WINDOW_HEIGHT - GameConfig.GROUND_HEIGHT - GameConfig.GRASS_HEIGHT / 2,
            GameConfig.WINDOW_WIDTH,
            GameConfig.GRASS_HEIGHT,
            GameConfig.GRASS_COLOR
        );
        this.elements.push(grass);
    }

    destroy() {
        this.elements.forEach(element => element.destroy());
        this.elements = [];
    }
} 