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
        this.load.spritesheet('npc1', 'assets/npc/male/NPC 1.png', {
            frameWidth: GameConfig.SPRITE_WIDTH,
            frameHeight: GameConfig.SPRITE_HEIGHT
        });

        this.load.spritesheet('npc2', 'assets/npc/female/NPC 2.png', {
            frameWidth: GameConfig.SPRITE_WIDTH,
            frameHeight: GameConfig.SPRITE_HEIGHT
        });

        this.load.spritesheet('npc3', 'assets/npc/female/NPC 3.png', {
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

        this.load.spritesheet('wallpaper_tiles', 'assets/world/Wallpaper Tilesets.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.currentFloor = 0;
        this.elevator_X_position = 250;
    }

    create() {
        this.createEnvironment();
        this.createPlayerEntities();
        this.createUI();

        this.selectionPointer = this.add.image(0, 0, 'UI_Pointer_white');
        this.selectionPointer.setOrigin(0.5, 1);
        this.selectionPointer.setScale(2);
        this.selectionPointer.setVisible(false); 
        this.selectionPointer.setDepth(30); 
     
        // Initialize automated NPC behaviors
        this.initializeNPCBehaviors();

        this.elevatorManager = new ElevatorManager(this);
        this.input.on('pointerdown', (pointer) => {
            if (pointer.rightButtonDown()) {
                const clicked = this.players.find(({ player }) => {
                    return Phaser.Geom.Rectangle.Contains(
                        new Phaser.Geom.Rectangle(player.x - 16, player.y - 48, 32, 32),
                        pointer.worldX,
                        pointer.worldY
                    );
                });

                // Re-enable automation for previously selected player
                if (this.selectedPlayer && this.selectedPlayer !== (clicked ? clicked.player : null)) {
                    this.selectedPlayer.isAutomated = true;
                    // Don't interrupt any movement - let them complete their destination
                }
                
                this.selectedPlayer = clicked ? clicked.player : null;
                
                // Disable automation for newly selected player
                if (this.selectedPlayer) {
                    this.selectedPlayer.isAutomated = false;
                    // Stop any automated movement when selected (but keep player-commanded movement)
                    if (!this.selectedPlayer.playerCommandedMovement) {
                        this.selectedPlayer.targetX = null;
                        this.selectedPlayer.vx = 0;
                        this.selectedPlayer.isWalking = false;
                        this.selectedPlayer.isIdling = false;
                    }
                    // Note: Keep playerCommandedMovement flag intact so they continue to destination
                }
                
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
                selected.playerCommandedMovement = true;
                this.onElevatorZoneClicked(clickedFloor, selected);
  
            } else {
                selected.targetX = pointer.worldX;
                selected.playerCommandedMovement = true;
            }
        });

    }

    initializeNPCBehaviors() {
        // Set up automated movement for NPCs
        this.players.forEach(({ player, sprite }, index) => {
            // Set up movement boundaries based on floor
            if (player.currentFloor === 0) {
                // Lobby has wider movement area (extend further right)
                player.minX = 200;
                player.maxX = 500;
            } else {
                // Other floors have narrower movement area
                player.minX = 280;
                player.maxX = 500;
            }
            
            // Initialize automated movement properties
            player.direction = Math.random() > 0.5 ? 1 : -1;
            player.isAutomated = true;
            player.automatedSpeed = GameConfig.CHAR_SPEED * 0.4; // Slower speed for automated NPCs (40% of normal)
            player.idleTimer = 0;
            player.idleDuration = 2 + Math.random() * 3; // Random idle time between 2-5 seconds
            player.isIdling = false;
            // Start with a random initial movement
            const initialDistance = 60 + Math.random() * 80;
            player.targetX = Math.max(player.minX, Math.min(player.maxX, player.x + (player.direction * initialDistance)));
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
        { name: ['John', 'Sim'], floor: 0, sprite: 'npc1' },
        { name: ['Alice', 'Lee'], floor: 2, sprite: 'npc2' },
         { name: ['Sarah', 'Johnson'], floor: 1, sprite: 'npc3' },
    ];

    // Track unique sprite keys to avoid duplicate animation creation
    const createdAnimations = new Set();

    playerConfigs.forEach(cfg => {
        const y = this.getFloorY(cfg.floor);
        const player = new Player(cfg.name[0], cfg.name[1], GameConfig.WINDOW_WIDTH / 2, y, cfg.sprite, cfg.floor);
        const playerSprite = new PlayerSprite(this, player);
        
        // Only create animations once per unique sprite key
        if (!createdAnimations.has(cfg.sprite)) {
            AnimationManager.createAnimations(this, cfg.sprite);
            createdAnimations.add(cfg.sprite);
        }
        
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
            // Update player status (thirst, hunger, sleep)
            player.updateStatus(dt);
            
            // Handle automated NPC behavior
            if (player.isAutomated && player !== this.selectedPlayer && !player.waitingForElevator && !player.inElevator) {
                // If they have a player-commanded movement, use normal movement
                if (player.playerCommandedMovement && player.targetX !== null) {
                    const previousTargetX = player.targetX;
                    player.moveTowardTarget(dt);
                    // Check if they just reached their destination
                    if (previousTargetX !== null && player.targetX === null) {
                        player.playerCommandedMovement = false;
                        player.isIdling = true;
                        player.idleTimer = 0;
                        player.idleDuration = 1 + Math.random() * 2;
                    }
                } else if (player.playerCommandedMovement && player.targetX === null) {
                    // Edge case: playerCommandedMovement is true but targetX is already null
                    player.playerCommandedMovement = false;
                    player.isIdling = true;
                    player.idleTimer = 0;
                    player.idleDuration = 1 + Math.random() * 2;
                } else {
                    this.updateAutomatedBehavior(player, dt);
                }
            } else {
                // Regular player movement
                player.moveTowardTarget(dt);
            }
            
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

        if (this.selectionPointer) {
            if (this.selectedPlayer) {
                this.selectionPointer.setVisible(true);
                this.selectionPointer.x = this.selectedPlayer.x;
                this.selectionPointer.y = this.selectedPlayer.y - 48; // adjust for head height
                if(this.selectedPlayer.inElevator)
                     this.selectionPointer.setVisible(false);
            } else {
                this.selectionPointer.setVisible(false);
            }
        }


        this.sidebar.updatePosition();
        this.sidebar.updateStatusBars();
        //this.inputManager.update(dt);
    }

    updateAutomatedBehavior(player, dt) {
        if (player.isIdling) {
            // Handle idle state - NPC is stationary
            player.vx = 0;
            player.isWalking = false;
            player.idleTimer += dt;
            
            if (player.idleTimer >= player.idleDuration) {
                // End idle period and start moving
                player.isIdling = false;
                player.idleTimer = 0;
                const distance = 60 + Math.random() * 120; // Random movement distance
                let newTargetX = player.x + (player.direction * distance);
                
                // If new target would be out of bounds, reverse direction
                if (newTargetX <= player.minX || newTargetX >= player.maxX) {
                    player.direction *= -1;
                    newTargetX = player.x + (player.direction * distance);
                }
                
                // Clamp target within boundaries
                player.targetX = Math.max(player.minX + 10, Math.min(player.maxX - 10, newTargetX));
                player.playerCommandedMovement = false; // This is automated movement
            }
        } else if (player.targetX !== null) {
            // Move toward target using slower automated speed
            const originalSpeed = player.speed;
            player.speed = player.automatedSpeed;
            player.moveTowardTarget(dt);
            player.speed = originalSpeed; // Restore original speed
            
            // Check if reached target or boundaries
            const reachedTarget = Math.abs(player.x - player.targetX) < 5;
            const hitBoundary = player.x <= player.minX + 5 || player.x >= player.maxX - 5;
            
            if (reachedTarget || hitBoundary) {
                // Stop and start idle period
                player.targetX = null;
                player.vx = 0;
                player.isWalking = false;
                player.isIdling = true;
                player.idleTimer = 0;
                player.idleDuration = 1.5 + Math.random() * 3; // Random idle time between 1.5-4.5 seconds
                
                // If hit boundary, reverse direction for next movement
                if (hitBoundary) {
                    player.direction *= -1;
                }
            }
            
            // Small random chance to stop and idle mid-movement
            if (Math.random() < 0.003) {
                player.targetX = null;
                player.vx = 0;
                player.isWalking = false;
                player.isIdling = true;
                player.idleTimer = 0;
                player.idleDuration = 1 + Math.random() * 2;
            }
        } else {
            // Safety fallback - shouldn't happen, but just in case
            player.isIdling = true;
            player.idleTimer = 0;
            player.idleDuration = 1 + Math.random() * 2;
        }
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
            // Clear the playerCommandedMovement flag since they can't reach their destination
            if (player.playerCommandedMovement) {
                player.playerCommandedMovement = false;
                // If automated, transition to idle
                if (player.isAutomated) {
                    player.isIdling = true;
                    player.idleTimer = 0;
                    player.idleDuration = 1 + Math.random() * 2;
                }
            }
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

        if (y >= top && y <= bottom) {
            return i;
        }
    }

    console.log("→ No valid floor clicked");
    return -1;
}


} 