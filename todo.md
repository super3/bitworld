# TODO: Code Refactoring Checklist

## Duplicate Code Refactoring

### High Priority
- [ ] **Floor Y Position Calculations**
  - [ ] Create a centralized `PositionUtils` class for floor calculations
  - [ ] Refactor `GameScene.js:262-266` getFloorY()
  - [ ] Refactor `BuildingManager.js:38-44` calculateFloorPosition()
  - [ ] Update `DoorManager.js:7` floor position calculation
  - [ ] Update `ElevatorManager.js` lines 16, 46, 106, 286

### Medium Priority
- [ ] **Idle State Reset Pattern**
  - [ ] Create `IdleStateManager` or helper method
  - [ ] Refactor 6 instances in GameScene.js (lines 337-340, 344-346, 428-431, 442-445, 450-452, 488-491)

- [ ] **Proximity/Distance Checks**
  - [ ] Create `ProximityUtils.isWithinDistance(obj1, obj2, threshold)`
  - [ ] Replace distance checks in:
    - [ ] `GameScene.js:297` (elevator proximity)
    - [ ] `Player.js:45` (movement threshold)
    - [ ] `DoorManager.js:41` (door proximity)

- [ ] **Sequential Processing Pattern**
  - [ ] Create base class or utility for sequential operations
  - [ ] Refactor `ElevatorManager.sequentialBoarding()`
  - [ ] Refactor `ElevatorManager.sequentialExiting()`

### Low Priority
- [ ] **Animation Key Generation**
  - [ ] Create `AnimationUtils.getAnimationKey(action, spriteKey)`
  - [ ] Update `PlayerSprite.js:20-21`
  - [ ] Update `AnimationManager.js:7-8`

- [ ] **Sprite Loading Pattern**
  - [ ] Create sprite configuration array
  - [ ] Loop through configuration in `GameScene.preload()`
  - [ ] Remove repetitive sprite loading code

- [ ] **Door Creation Pattern**
  - [ ] Create door configuration array with positions
  - [ ] Loop through configuration in `GameScene.createEnvironment()`
  - [ ] Remove repetitive door.addDoor() calls

- [ ] **Rectangle Creation Pattern**
  - [ ] Create helper method in EnvironmentManager
  - [ ] Refactor createSky(), createGround(), createBackground()

## Additional Refactoring Tasks

### Code Style Standardization
- [ ] Convert `DoorManager` from prototype to ES6 class
- [ ] Extract magic numbers to `GameConfig.js`
- [ ] Remove active console.log statements (lines 99, 517 in GameScene.js)

### Architecture Improvements
- [ ] Split `GameScene.js` (521 lines) into smaller managers
- [ ] Implement proper state management for Player
- [ ] Create event system for loose coupling between components