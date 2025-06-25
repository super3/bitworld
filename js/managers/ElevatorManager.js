
class ElevatorManager {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.isLocked = false;

        this.elevatorZones = [];
        this.zoneGraphics = [];

        this.currentDoorState = Array(this.scene.buildingManager.floors.length).fill('closed');
        this.elevatorCurrentFloor = scene.currentFloor;

        const elevatorX = this.scene.elevator_X_position;

        this.activeRequest = null;
        this.boardedPlayers = [];
        this.elevatorSprites = [];
        for (let i = 0; i < scene.buildingManager.floors.length; i++) {
            const y = scene.getFloorY(i) - GameConfig.GROUND_HEIGHT - GameConfig.SPRITE_HEIGHT;

            const zone = scene.add.zone(elevatorX, y, 50, 50);
            zone.setInteractive();
            zone.floorIndex = i;

            /*
            const g = this.scene.add.graphics();
            g.lineStyle(2, 0xFFFF00);
            if (i === this.elevatorCurrentFloor) {
                g.fillStyle(0xFFFF00, 0.3);
                g.fillRect(elevatorX - 25, y - 25, 50, 50);
            }
            g.strokeRect(elevatorX - 25, y - 25, 50, 50);
            this.zoneGraphics.push(g);
            g.setAlpha(i === this.elevatorCurrentFloor ? 0.3 : 0); // only keep yellow tint
            */

            this.elevatorZones.push(zone);
            const elevatorSprite = this.scene.add.image(elevatorX, y+25, 'Elevator_closed');
            elevatorSprite.setDepth(1);
            elevatorSprite.setScale(2); // or maybe 1.15 for better fit

            elevatorSprite.setOrigin(0.5, 1); // bottom aligned

            this.elevatorSprites.push(elevatorSprite);
        }
    }

    requestElevator(player, targetFloor) {
        player.waitingForElevator = true;
        player.targetFloor = targetFloor;

        if (!this.activeRequest) {
        
            this.activeRequest = { player, targetFloor };
            this.processQueue();
        }
    }

    processQueue() {
        if (this.isLocked || !this.activeRequest) return;

        const { player } = this.activeRequest;
        const startFloor = this.elevatorCurrentFloor;
        const endFloor = player.currentFloor;

        if (startFloor === endFloor) {
     
            this.beginBoarding();
        } else {
            this.moveToFloor(endFloor, () => {
            
                this.beginBoarding();
            });
        }
    }

    moveToFloor(targetFloor, onArriveCallback) {
        this.isLocked = true;
        const direction = Math.sign(targetFloor - this.elevatorCurrentFloor);
        const steps = Math.abs(targetFloor - this.elevatorCurrentFloor);
        let count = 0;

        const timer = this.scene.time.addEvent({
            delay: 1000,
            repeat: steps,
            callback: () => {
                this.elevatorCurrentFloor += direction;
                //this.updateZoneGraphics(this.elevatorCurrentFloor);
                count++;
                if (count === steps) {
                    timer.remove();
                    onArriveCallback();
                }
            }
        });
    }

    beginBoarding() {
        const originalTarget = this.activeRequest.targetFloor;
        const direction = Math.sign(originalTarget - this.elevatorCurrentFloor);
        const floor = this.elevatorCurrentFloor;

        const hasBoarders = this.scene.players.some(({ player }) =>
            player.currentFloor === floor &&
            player.waitingForElevator &&
            Math.sign(player.targetFloor - player.currentFloor) === direction
        );

        const hasExiters = this.boardedPlayers.some(p => p.targetFloor === floor);
        if (hasBoarders || hasExiters) {
            this.updateElevatorSprite(floor, true); // Open doors

            // Step 1: small delay to simulate door open
            this.scene.time.delayedCall(400, () => {
                // Step 2: show exiting players
                const exiting = this.boardedPlayers.filter(p => p.targetFloor === floor);
                exiting.forEach(player => {
                    player.currentFloor = floor;
                    player.y = this.scene.getFloorY(floor);
                    player.targetFloor = null;
                    player.waitingForElevator = false;
                    player.spriteRef.setVisible(true);
                    if (player.deferredTargetX !== undefined) {
                        player.targetX = player.deferredTargetX;
                        delete player.deferredTargetX;
                    }
                    player.inElevator = false;
                });
                this.boardedPlayers = this.boardedPlayers.filter(p => p.targetFloor !== floor);

                this.boardPlayersAtCurrentFloor(direction);

                // Step 3: close doors after short delay
                this.scene.time.delayedCall(500, () => {
                    this.updateElevatorSprite(floor, false); // Close doors
            
                    this.continueElevatorTravel(originalTarget, direction);
                });
            });
        } else {
            // No one getting on or off — continue immediately
        
            this.continueElevatorTravel(originalTarget, direction);
        }
    }

    boardPlayersAtCurrentFloor(direction) {
        const floor = this.elevatorCurrentFloor;

        const newBoarders = this.scene.players
            .filter(({ player }) =>
                player.currentFloor === floor &&
                player.waitingForElevator &&
                Math.sign(player.targetFloor - player.currentFloor) === direction
            )
            .map(({ player }) => player);

        newBoarders.forEach(player => {
            player.spriteRef.setVisible(false);
            this.boardedPlayers.push(player);
            player.inElevator = true;
            player.waitingForElevator = false;
        });
    }

    continueElevatorTravel(originalTarget, direction) {

    let  stepsRemaining = Math.abs(originalTarget - this.elevatorCurrentFloor);
        let stepsTaken = 0;

        const stepTimer = this.scene.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                this.elevatorCurrentFloor += direction;
                const floor = this.elevatorCurrentFloor;

                const exiting = this.boardedPlayers.filter(p => p.targetFloor === floor);
                this.boardedPlayers = this.boardedPlayers.filter(p => p.targetFloor !== floor);
                exiting.forEach(player => {
                    player.currentFloor = floor;
                    player.y = this.scene.getFloorY(floor);
                    player.targetFloor = null;
                    player.waitingForElevator = false;
                    player.inElevator = false;
                    player.spriteRef.setVisible(true);
                    if (player.deferredTargetX !== undefined) {
                        player.targetX = player.deferredTargetX;
                        delete player.deferredTargetX;
                    }
        
                });
                

                // Check for new boarders BEFORE delay
                const newBoarders = this.scene.players
                    .filter(({ player }) =>
                        player.currentFloor === floor &&
                        player.waitingForElevator &&
                        Math.sign(player.targetFloor - player.currentFloor) === direction
                    )
                    .map(({ player }) => player);

                const hasActivity = exiting.length > 0 || newBoarders.length > 0;

                if (hasActivity) {
                    this.updateElevatorSprite(floor, true); // Open doors

                    this.scene.time.delayedCall(300, () => {
                        // Board new players after brief delay
                        newBoarders.forEach(player => {
                            player.spriteRef.setVisible(false);
                            player.inElevator = true;
                            player.waitingForElevator = false;
                            this.boardedPlayers.push(player);
                        });

                        this.scene.time.delayedCall(500, () => {
                            this.updateElevatorSprite(floor, false); // Close doors
                        });
                    });
                }

                stepsTaken++;

                if (stepsTaken >= stepsRemaining) {
                    this.updateElevatorSprite(floor, true); // Final open

                    stepTimer.remove();
                    this.isLocked = false;
                    this.activeRequest = null;

                    // Check if any passengers onboard still need to go somewhere
                    const remainingPassenger = this.boardedPlayers.find(p => p.targetFloor != null);
                    if (remainingPassenger) {
                        // Assign them as the new active request
                        this.activeRequest = {
                            player: remainingPassenger,
                            targetFloor: remainingPassenger.targetFloor
                        };
                        this.processQueue();
                    } else {
                        //  If no one is left onboard, check for any players still waiting for pickup
                        const next = this.scene.players.find(({ player }) => player.waitingForElevator);
                        if (next) {
                            this.activeRequest = {
                                player: next.player,
                                targetFloor: next.player.targetFloor
                            };
                            this.processQueue();
                        }
                    }

                    this.scene.time.delayedCall(500, () => {
                        this.updateElevatorSprite(floor, false); // Final close
                    });
                }
            }
        });
    }


    updateZoneGraphics(currentFloor) {
        this.zoneGraphics.forEach((g, i) => {
            g.clear();

            const zone = this.elevatorZones[i];
            const x = zone.x;
            const y = zone.y;

            if (i === currentFloor) {
                g.fillStyle(0xFFFF00, 0.3);
                g.fillRect(x - 25, y - 25, 50, 50);
            }

            g.strokeRect(x - 25, y - 25, 50, 50);
            g.setAlpha(i === currentFloor ? 0.3 : 0); // <-- important
        });
    }

    updateElevatorSprite(floorIndex, isOpen) {
        const sprite = this.elevatorSprites[floorIndex];
        if (!sprite) return;

        const textureKey = isOpen ? 'Elevator_opened' : 'Elevator_closed';
        if (this.currentDoorState[floorIndex] !== (isOpen ? 'open' : 'closed')) {
            sprite.setTexture(textureKey);
            this.currentDoorState[floorIndex] = isOpen ? 'open' : 'closed';
        }
    }

}
