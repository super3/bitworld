

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
        this.load.spritesheet('npc1', 'assets/npc/Male/NPC 1.png', {
            frameWidth: GameConfig.SPRITE_WIDTH,
            frameHeight: GameConfig.SPRITE_HEIGHT
        });

        this.load.spritesheet('npc2', 'assets/npc/Female/NPC 2.png', {
            frameWidth: GameConfig.SPRITE_WIDTH,
            frameHeight: GameConfig.SPRITE_HEIGHT
        });

        // Load building sprites
        this.load.image('lobby', 'assets/world/apartment_lobby.png');
        this.load.image('design1', 'assets/world/apartment_design1.png');
        this.load.image('design2', 'assets/world/apartment_design2.png');
        this.load.image('design3', 'assets/world/apartment_design3.png');
        this.load.image('roof', 'assets/world/apartment_roof.png');
        this.load.image('Elevator_opened', 'assets/world/Elevator_opened.png');
        this.load.image('Elevator_slightlyOpened', 'assets/world/Elevator_slightlyOpened.png');
        this.load.image('Elevator_closed', 'assets/world/Elevator_closed.png');
        this.load.image('Elevator_light', 'assets/world/Elevator_light.png');
        this.load.image('Door_closed', 'assets/world/Door_closed.png');
        this.load.image('Door_opened', 'assets/world/Door_opened.png');
        this.load.image('Door_glass_closed', 'assets/world/Door_glass_closed.png');
        this.load.image('Door_glass_opened', 'assets/world/Door_glass_opened.png');
        this.load.image('UI_Pointer_white', 'assets/ui/Pointer_white.png');

        this.currentFloor = 0;
        this.elevator_X_position = 250;
    }

    create() {
        this.createEnvironment();
        this.createPlayerEntities();
        this.createUI();
        //this.setupInput();

        this.selectionPointer = this.add.image(0, 0, 'UI_Pointer_white');
        this.selectionPointer.setOrigin(0.5, 1);
        this.selectionPointer.setScale(2);
        this.selectionPointer.setVisible(false); 
        this.selectionPointer.setDepth(30); 
     
        this.elevatorManager = new ElevatorManager(this, this.player);
        this.input.on('pointerdown', (pointer) => {
            if (pointer.rightButtonDown()) {
                const clicked = this.players.find(({ player }) => {
                    return Phaser.Geom.Rectangle.Contains(
                        new Phaser.Geom.Rectangle(player.x - 16, player.y - 48, 32, 32),
                        pointer.worldX,
                        pointer.worldY
                    );
                });

                this.selectedPlayer = clicked ? clicked.player : null;
                this.sidebar.updatePlayer(this.selectedPlayer);
                console.log(this.selectedPlayer);
                return;
            }

            const selected = this.selectedPlayer;
            if (!selected) return;



            if (this.elevatorManager.boardedPlayers.includes(selected)) return;

            if(selected.inElevator) return;
 
            if (selected) {
                if(selected.elevatorClickTimer)
                       selected.elevatorClickTimer.remove();

                selected.waitingForElevator = false;
                selected.walkingThroughDoor = false;
            }


            const clickedFloor = this.getClickedFloorIndex(pointer.worldY);
            if (clickedFloor === -1) return;

            if (clickedFloor !== selected.currentFloor) {
                selected.deferredTargetX = pointer.worldX;
                this.onElevatorZoneClicked(clickedFloor, selected);
  
            } else {
                selected.targetX = pointer.worldX;
            }
        });

    }




    createEnvironment() {
        this.environmentManager = new EnvironmentManager(this);
        this.buildingManager = new BuildingManager(this);
        this.createFloorWalls();

        this.doorManager = new DoorManager(this);

        this.doorManager.addDoor( 0, 180,10, GameConfig.SPRITE_HEIGHT+15, "Door_glass");

        this.doorManager.addDoor( 1, 532,10, GameConfig.SPRITE_HEIGHT+15,"Door");
        this.doorManager.addDoor( 1, 436,10, GameConfig.SPRITE_HEIGHT+15,"Door");
        this.doorManager.addDoor( 1, 308,10, GameConfig.SPRITE_HEIGHT+15,"Door");

        this.doorManager.addDoor( 2, 532,10, GameConfig.SPRITE_HEIGHT+15,"Door");
        this.doorManager.addDoor( 2, 436,10, GameConfig.SPRITE_HEIGHT+15,"Door");
        this.doorManager.addDoor( 2, 308,10, GameConfig.SPRITE_HEIGHT+15,"Door");

        this.doorManager.addDoor( 3, 532,10, GameConfig.SPRITE_HEIGHT+15,"Door");
        this.doorManager.addDoor( 3, 436,10, GameConfig.SPRITE_HEIGHT+15,"Door");
        this.doorManager.addDoor( 3, 308,10, GameConfig.SPRITE_HEIGHT+15,"Door");

        
    }

createFloorWalls() {
    const scaledHeight = GameConfig.BUILDING_HEIGHT * GameConfig.BUILDING_SCALE;
    const buildingCenterX = GameConfig.WINDOW_WIDTH / 2;
    const halfBuildingWidth = GameConfig.BUILDING_WIDTH / 2;

    this.floorWalls = [];

    this.buildingManager.floors.forEach((_, index) => {
        const y = GameConfig.WINDOW_HEIGHT - GameConfig.GROUND_HEIGHT -
            scaledHeight * (index + 1) + scaledHeight / 2;

        // Extend floor 0 right wall down by extra pixels
        const extraHeight = (index === 0) ? GameConfig.SPRITE_HEIGHT : 0;
        const wallHeight = scaledHeight + extraHeight;
        const adjustedY = y + (extraHeight / 2);

        // Right wall
        const rightX = buildingCenterX + halfBuildingWidth + 80;
        const rightWall = this.add.rectangle(rightX, adjustedY, 10, wallHeight, 0xff0000)
            .setOrigin(0.5)
            .setDepth(999)
            .setAlpha(0); // ← Hide it;
        this.floorWalls.push(rightWall);

        // Left wall (skip on floor 0)
        if (index !== 0) {
            const leftX = buildingCenterX - halfBuildingWidth - 80;
            const leftWall = this.add.rectangle(leftX, y, 10, scaledHeight, 0xff0000)
                .setOrigin(0.5)
                .setDepth(999)
                .setAlpha(0); // ← Hide it;
            this.floorWalls.push(leftWall);
        }
    });
}


    createPlayerEntities() {
    this.players = [];

    const playerConfigs = [
        { name: ['John', 'Sim'], floor: 3, sprite: 'npc1' },
        { name: ['Alice', 'Lee'], floor: 2, sprite: 'npc2' },
         { name: ['Alice2', 'Lee2'], floor: 1, sprite: 'npc2' },
    ];

    playerConfigs.forEach(cfg => {
        const y = this.getFloorY(cfg.floor);
        const player = new Player(cfg.name[0], cfg.name[1], GameConfig.WINDOW_WIDTH / 2, y, cfg.sprite, cfg.floor);
        const playerSprite = new PlayerSprite(this, player);
        AnimationManager.createAnimations(this, cfg.sprite);
        this.players.push({ player, sprite: playerSprite });
    });

    this.selectedPlayer = null;

    }

    createUI() {
        this.sidebar = new Sidebar(this, null);//add player here to control one at start
    }

    setupInput() {
        this.inputManager = new InputManager(this); 
    }

    getFloorY(floorIndex) {
    const scaledHeight = GameConfig.BUILDING_HEIGHT * GameConfig.BUILDING_SCALE;
    return GameConfig.WINDOW_HEIGHT - (GameConfig.GROUND_HEIGHT)- (GameConfig.SPRITE_HEIGHT +3) - 
            scaledHeight * (floorIndex) + scaledHeight / 2;
    }

onElevatorZoneClicked(targetFloor, player) {
    if (!player) return;
    
    // Cancel previous pending movement
    if (player.elevatorClickTimer) {
        player.elevatorClickTimer.remove();
        player.elevatorClickTimer = null;
    }

    // Case: Same floor clicked, cancel movement toward elevator
    if (player.currentFloor === targetFloor) {
        player.targetX = null;
        player.vx = 0;
        return;
    }

    // Case: Already requesting elevator (still allow override if it's a different floor)
    if (player.inElevator === true) return;
    if (this.elevatorManager.activeRequest && this.elevatorManager.activeRequest.player === player) return;

    // Update target floor and set new targetX
    player.targetFloor = targetFloor;
    player.targetX = this.elevator_X_position + 0;

    const arrivalCheck = this.time.addEvent({
        delay: 50,
        loop: true,
        callback: () => {
            const dx = Math.abs(player.x - (this.elevator_X_position+0));
            // Cancel if they somehow entered elevator or changed mind again
            if (
                player.inElevator === true ||
                player.currentFloor === targetFloor || // Clicked current floor again mid-way
                (this.elevatorManager.activeRequest && this.elevatorManager.activeRequest.player === player)
            ) {
                arrivalCheck.remove();
                player.elevatorClickTimer = null;
                return;
            }
            player.targetX = this.elevator_X_position;
            // Snap to elevator and request
            if (dx < 40) {
                player.targetX = null;
                player.vx = 0;
                arrivalCheck.remove();
                player.elevatorClickTimer = null;
                this.elevatorManager.requestElevator(player, targetFloor);
            }
        }
    });

    player.elevatorClickTimer = arrivalCheck;
}



    update(time, delta) {
        const dt = delta / 1000;

        this.players.forEach(({ player, sprite }) => {
            player.moveTowardTarget(dt);
            this.checkWallCollision(player, sprite);
            sprite.update();
        });

        this.players.forEach(({ player, sprite }) => {
             // Handle door interaction
            const dx = player.vx;
            if (Math.abs(dx) > 0.1) {
                this.doorManager.tryOpenDoor(player, dx);
            }

            // Reset if player stops moving or exits door area
            if (Math.abs(dx) < 0.1 && player.hasEnteredDoor) {
                player.hasEnteredDoor = false;
            }
        });

        if (this.selectedPlayer) {
            this.selectionPointer.setVisible(true);
            this.selectionPointer.x = this.selectedPlayer.x;
            this.selectionPointer.y = this.selectedPlayer.y - 48; // adjust for head height
            if(this.selectedPlayer.inElevator)
                 this.selectionPointer.setVisible(false);
        } else {
            this.selectionPointer.setVisible(false);
        }


        this.sidebar.updatePosition();
        //this.inputManager.update(dt);
    }

    checkWallCollision(player, sprite)
    {
    const px = player.x;
    const py = player.y;

    this.floorWalls.forEach(wall => {
        const wx = wall.x;
        const wy = wall.y;
        const halfW = wall.width / 2;
        const halfH = wall.height / 2;

        const isSameFloor = Math.abs(py - wy) < GameConfig.BUILDING_HEIGHT * GameConfig.BUILDING_SCALE * 0.6;
        const isOverlapping = (
            Math.abs(px - wx) < halfW + GameConfig.SPRITE_WIDTH * GameConfig.SCALE_FACTOR / 2 &&
            isSameFloor
        );

        if (isOverlapping) {
            // Push player back depending on direction of velocity
            if (player.vx > 0) {
                player.x = wx - halfW - (GameConfig.SPRITE_WIDTH * GameConfig.SCALE_FACTOR / 2);
            } else if (player.vx < 0) {
                player.x = wx + halfW + (GameConfig.SPRITE_WIDTH * GameConfig.SCALE_FACTOR / 2);
            }

            player.vx = 0;
            player.targetX = null;
        }
    });
    }

getClickedFloorIndex(y) {
    const scaledHeight = GameConfig.BUILDING_HEIGHT * GameConfig.BUILDING_SCALE;

    for (let i = this.buildingManager.floors.length - 1; i >= 0; i--) {
        const floorSprite = this.buildingManager.floors[i];
        const fy = floorSprite.y;
        const halfHeight = scaledHeight / 2;

        const top = fy - halfHeight;
        const bottom = fy + halfHeight;

        //console.log(`Checking floor ${i}: y=${y}, top=${top}, bottom=${bottom}`);

        if (y >= top && y <= bottom) {
            //console.log(`→ Clicked floor ${i}`);
            return i;
        }
    }

    console.log("→ No valid floor clicked");
    return -1;
}


} 