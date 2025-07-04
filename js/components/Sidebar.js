/**
 * Sidebar UI component for displaying player info and controls
 */
class Sidebar {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.elements = [];
        this.create();
    }

    create() {
        this.createBackground();
        this.createBorder();
        this.createPlayerInfo();
        this.createControls();
    }

    createBackground() {
        this.background = this.scene.add.rectangle(
            GameConfig.WINDOW_WIDTH + GameConfig.TEXT_BOX_WIDTH / 2,
            GameConfig.WINDOW_HEIGHT / 2,
            GameConfig.TEXT_BOX_WIDTH,
            GameConfig.WINDOW_HEIGHT,
            GameConfig.TEXT_BOX_COLOR
        );
        this.elements.push(this.background);
    }

    createBorder() {
        this.border = this.scene.add.rectangle(
            GameConfig.WINDOW_WIDTH,
            GameConfig.WINDOW_HEIGHT / 2,
            GameConfig.SIDEBAR_BORDER_WIDTH,
            GameConfig.WINDOW_HEIGHT,
            GameConfig.SIDEBAR_BORDER_COLOR
        );
        this.elements.push(this.border);
    }

    createPlayerInfo() {
        let nameVal = ``;
        if(this.player != null)
        {
            nameVal =`${this.player.firstName} ${this.player.lastName}`
        }
        this.playerName = this.scene.add.text(
            GameConfig.SIDEBAR_MARGIN,
            GameConfig.SIDEBAR_PLAYER_Y,
            nameVal,
            GameConfig.SIDEBAR_PLAYER_STYLE
        );
        this.elements.push(this.playerName);

        // Create position text that will be updated
        let posVal = `Position: (-,-)`;
        if(this.player != null)
        {
            posVal =`Position: (${Math.floor(this.player.x)}, ${Math.floor(this.player.y)})`
        }
        this.positionText = this.scene.add.text(
            GameConfig.SIDEBAR_MARGIN,
            GameConfig.SIDEBAR_PLAYER_Y + 25,
            posVal,
            {
                fontSize: '12px',
                fill: '#b0b0b0',  // Light gray for better contrast
                fontFamily: 'monospace'
            }
        );
        this.elements.push(this.positionText);
    }

    createControls() {
        // Controls header
        this.controlsHeader = this.scene.add.text(
            GameConfig.SIDEBAR_MARGIN,
            GameConfig.SIDEBAR_CONTROLS_Y,
            "CONTROLS:",
            GameConfig.SIDEBAR_HEADER_STYLE
        );
        this.elements.push(this.controlsHeader);

        // Create mouse icon with controls
        const controlsY = GameConfig.SIDEBAR_CONTROLS_Y + 25;
        
        // Left click control
        this.leftClickIcon = this.scene.add.graphics();
        this.leftClickIcon.fillStyle(0x94a3b8, 1);  // Light gray for mouse body
        this.leftClickIcon.fillRoundedRect(GameConfig.SIDEBAR_MARGIN, controlsY, 18, 20, 3);
        this.leftClickIcon.fillStyle(0x64b5f6, 1);  // Accent blue for left button
        this.leftClickIcon.fillRect(GameConfig.SIDEBAR_MARGIN + 2, controlsY + 2, 7, 10);
        this.leftClickIcon.lineStyle(1, 0x2196f3, 1);  // Blue border
        this.leftClickIcon.strokeRect(GameConfig.SIDEBAR_MARGIN + 2, controlsY + 2, 7, 10);
        this.elements.push(this.leftClickIcon);
        
        this.leftClickText = this.scene.add.text(
            GameConfig.SIDEBAR_MARGIN + 25,
            controlsY + 2,
            "Move Player",
            GameConfig.SIDEBAR_CONTROLS_STYLE
        );
        this.elements.push(this.leftClickText);
        
        // Right click control
        const rightClickY = controlsY + 30;
        this.rightClickIcon = this.scene.add.graphics();
        this.rightClickIcon.fillStyle(0x94a3b8, 1);  // Light gray for mouse body
        this.rightClickIcon.fillRoundedRect(GameConfig.SIDEBAR_MARGIN, rightClickY, 18, 20, 3);
        this.rightClickIcon.fillStyle(0x64b5f6, 1);  // Accent blue for right button
        this.rightClickIcon.fillRect(GameConfig.SIDEBAR_MARGIN + 9, rightClickY + 2, 7, 10);
        this.rightClickIcon.lineStyle(1, 0x2196f3, 1);  // Blue border
        this.rightClickIcon.strokeRect(GameConfig.SIDEBAR_MARGIN + 9, rightClickY + 2, 7, 10);
        this.elements.push(this.rightClickIcon);
        
        this.rightClickText = this.scene.add.text(
            GameConfig.SIDEBAR_MARGIN + 25,
            rightClickY + 2,
            "Select Player",
            GameConfig.SIDEBAR_CONTROLS_STYLE
        );
        this.elements.push(this.rightClickText);
    }



    updatePlayer(_player)
    {
        this.player = _player;
        this.updateName()
        this.updatePosition();
    }

    updatePosition() {
        if (this.positionText) {
            let posVal = `Position: (-,-)`;
            if(this.player != null)
            {
                posVal =`Position: (${Math.floor(this.player.x)}, ${Math.floor(this.player.y)})`
            }
            this.positionText.setText(posVal);
        }
    }

    updateName() {
        if(this.playerName)
        {
            let nameVal = ``;
            if(this.player != null)
            {
                nameVal =`${this.player.firstName} ${this.player.lastName}`
            }
            this.playerName.setText(nameVal);
        }

    }

    destroy() {
        this.elements.forEach(element => element.destroy());
        this.elements = [];
    }
} 