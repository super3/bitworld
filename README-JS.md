# Simworld - JavaScript/Phaser.js Version

This is the JavaScript port of the Simworld game using Phaser.js framework.

## Features

- 2D character with animated walking and idle states
- Multi-story building environment
- Side panel with player information and controls
- Smooth character movement using A/D keys
- Frame-independent movement timing

## Prerequisites

- Modern web browser with JavaScript support
- Local web server (due to CORS restrictions for loading assets)

## Running the Game

### Option 1: Using Node.js (Recommended)

1. Install Node.js if you haven't already
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   npm start
   ```
4. The game will open automatically in your browser at `http://localhost:8080`

### Option 2: Using Python HTTP Server

If you have Python installed:

```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

Then open `http://localhost:8080` in your browser.

### Option 3: Using any other local server

You can use any local web server of your choice. Just serve the files from the root directory.

## Controls

- **A**: Move left
- **D**: Move right  
- **ESC**: Quit (close browser tab)

## File Structure

```
├── index.html          # Main HTML file
├── js/
│   ├── GameConfig.js   # Game configuration constants
│   ├── Player.js       # Player class
│   ├── GameScene.js    # Main game scene
│   └── main.js         # Game initialization
├── NPC/                # Character sprites
├── World/              # Building/environment sprites
└── package.json        # Node.js dependencies
```

## Differences from Python Version

- Uses Phaser.js framework instead of Pygame
- Runs in web browser instead of desktop application
- Uses modern JavaScript ES6+ features
- Improved sprite handling and animations
- Better scaling and responsive design

## Dependencies

- **Phaser.js 3.70.0**: Main game framework (loaded via CDN)
- **http-server**: For local development (dev dependency)
- **live-server**: Alternative development server with auto-reload (dev dependency)

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Troubleshooting

If you see a blank screen or console errors:

1. Make sure you're running the game through a web server (not file://)
2. Check that all asset files (images) are in the correct locations
3. Open browser developer tools (F12) to check for any console errors
4. Ensure your browser supports modern JavaScript features 