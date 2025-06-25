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
                fill: '#000000',
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

        // Create key controls
        this.createKeyControl('A', 'Move Left', GameConfig.SIDEBAR_KEY_A_Y);
        this.createKeyControl('D', 'Move Right', GameConfig.SIDEBAR_KEY_D_Y);
    }

    createKeyControl(key, label, y) {
        const keyConfig = GameConfig.SIDEBAR_KEY_CONFIG;
        
        // Key background and border
        const keyBorder = this.scene.add.rectangle(
            keyConfig.x, y, 
            keyConfig.size + keyConfig.borderWidth, 
            keyConfig.size + keyConfig.borderWidth, 
            keyConfig.borderColor
        );
        
        const keyBg = this.scene.add.rectangle(
            keyConfig.x, y, 
            keyConfig.size, keyConfig.size, 
            keyConfig.bgColor
        );

        // Key letter
        const keyText = this.scene.add.text(
            keyConfig.x - keyConfig.textOffset, 
            y - keyConfig.textOffset, 
            key, 
            keyConfig.textStyle
        );

        // Label
        const labelText = this.scene.add.text(
            keyConfig.x + keyConfig.labelOffset, 
            y - keyConfig.textOffset, 
            label, 
            keyConfig.labelStyle
        );

        this.elements.push(keyBorder, keyBg, keyText, labelText);
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