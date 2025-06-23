/**
 * Building manager for creating and positioning building elements
 */
class BuildingManager {
    constructor(scene) {
        this.scene = scene;
        this.floors = [];
        this.roof = null;
        this.create();
    }

    create() {
        this.createFloors();
        this.createRoof();
    }

    createFloors() {
        const floorData = [
            { sprite: 'lobby', index: 0 },
            { sprite: 'design1', index: 1 },
            { sprite: 'design2', index: 2 },
            { sprite: 'design3', index: 3 }
        ];

        floorData.forEach(floor => {
            this.floors.push(this.createFloor(floor.sprite, floor.index));
        });
    }

    createFloor(spriteName, index) {
        const position = this.calculateFloorPosition(index);
        const floor = this.scene.add.image(position.x, position.y, spriteName);
        floor.setScale(GameConfig.BUILDING_SCALE);
        return floor;
    }

    calculateFloorPosition(index) {
        const scaledHeight = GameConfig.BUILDING_HEIGHT * GameConfig.BUILDING_SCALE;
        return {
            x: GameConfig.WINDOW_WIDTH / 2,
            y: GameConfig.WINDOW_HEIGHT - GameConfig.GROUND_HEIGHT - 
               scaledHeight * (index + 1) + scaledHeight / 2
        };
    }

    createRoof() {
        const roofY = GameConfig.WINDOW_HEIGHT - GameConfig.GROUND_HEIGHT - 
                     (GameConfig.BUILDING_HEIGHT * GameConfig.BUILDING_SCALE) * 4.3;
        this.roof = this.scene.add.image(GameConfig.WINDOW_WIDTH / 2, roofY, 'roof');
        this.roof.setScale(GameConfig.BUILDING_SCALE);
    }

    destroy() {
        this.floors.forEach(floor => floor.destroy());
        if (this.roof) this.roof.destroy();
        this.floors = [];
        this.roof = null;
    }
} 