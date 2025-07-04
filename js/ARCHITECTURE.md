# Game Architecture

This document describes the refactored architecture of the bitworld.gg game.

## Overview

The game has been refactored from a single monolithic `GameScene.js` file into a modular component-based architecture for better maintainability, testability, and code organization.

## Core Architecture

### Configuration Layer
- **`GameConfig.js`** - Centralized configuration for all game constants, styling, colors, dimensions, and UI settings

### Game Objects
- **`Player.js`** - Player data model and movement logic
- **`GameScene.js`** - Main game scene coordinator (orchestrates other components)

### Component Layer
- **`components/PlayerSprite.js`** - Handles player sprite rendering and animation state
- **`components/Sidebar.js`** - Manages the UI sidebar with player info and controls

### Manager Layer
- **`managers/AnimationManager.js`** - Static class for creating and managing Phaser animations
- **`managers/BuildingManager.js`** - Handles building/environment sprite creation and positioning
- **`managers/EnvironmentManager.js`** - Creates background, ground, and sky elements
- **`managers/InputManager.js`** - Processes pointer input and updates player state

## Data Flow

```
main.js → GameScene → Managers/Components → Player/GameConfig
```

1. **Initialization**: `main.js` creates the Phaser game and initializes `GameScene`
2. **Scene Setup**: `GameScene.create()` orchestrates the creation of all systems:
   - `EnvironmentManager` creates background/ground
   - `BuildingManager` creates building sprites
   - `PlayerSprite` creates player sprite with proper positioning
   - `AnimationManager` sets up sprite animations
   - `Sidebar` creates UI elements
   - `InputManager` sets up pointer controls

3. **Game Loop**: `GameScene.update()` delegates to:
   - `InputManager.update()` processes input and updates player
   - `Sidebar.updatePosition()` refreshes position display

## Key Benefits

### Separation of Concerns
- Each component has a single, well-defined responsibility
- UI logic is separated from game logic
- Input handling is isolated from rendering

### Maintainability
- Changes to UI don't affect game logic
- Easy to modify individual systems without breaking others
- Clear code organization makes debugging easier

### Testability
- Individual components can be tested in isolation
- Mocking dependencies is straightforward
- Configuration is centralized and easily modified for testing

### Extensibility
- New components can be added without modifying existing code
- New managers can be created for additional game systems
- Configuration-driven approach makes feature flags easy

## Component Details

### PlayerSprite
- Manages sprite creation, positioning, and visual updates
- Handles animation state transitions
- Manages sprite flipping for direction changes

### Sidebar
- Creates pixel-art style UI panel
- Displays player information and controls
- Updates position display in real-time

### InputManager
- Processes pointer input for player movement
- Updates player movement state
- Maintains boundary constraints
- Updates sprite animations based on movement

### EnvironmentManager
- Creates sky background
- Creates ground and grass layers
- Handles environment-specific styling

### BuildingManager
- Positions and scales building sprites
- Manages floor stacking logic
- Handles roof positioning to prevent floating

## Configuration Philosophy

All visual styling, dimensions, colors, and game constants are centralized in `GameConfig.js`. This allows for:
- Easy theme changes
- Consistent styling across components
- Single source of truth for game parameters
- Easy tweaking of game balance and visual appearance

## File Dependencies

```
index.html
├── GameConfig.js (base configuration)
├── Player.js (data model)
├── components/
│   ├── PlayerSprite.js (requires: GameConfig, Player)
│   └── Sidebar.js (requires: GameConfig, Player)
├── managers/
│   ├── AnimationManager.js (requires: GameConfig)
│   ├── BuildingManager.js (requires: GameConfig)
│   ├── EnvironmentManager.js (requires: GameConfig)
│   └── InputManager.js (requires: GameConfig, Player, PlayerSprite)
├── GameScene.js (requires: all above)
└── main.js (requires: GameConfig, GameScene)
```

This architecture provides a solid foundation for future game development and feature additions. 