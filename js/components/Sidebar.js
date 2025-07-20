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
        this.createStatusBars();
        this.updateStatusBars();  // Initialize bars to grey if no player
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

    createStatusBars() {
        // Position status bars below the controls section
        const startY = GameConfig.SIDEBAR_CONTROLS_Y + 110;  // Controls header + 2 controls + extra spacing
        const barWidth = GameConfig.TEXT_BOX_WIDTH - 40;  // Leave 20px margin on each side
        const barHeight = 20;
        const barSpacing = 40;
        
        // Create thirst bar
        this.createStatusBar('Thirst', startY, barWidth, barHeight, 0x42a5f5, 'thirstBar', 'thirstText');
        
        // Create hunger bar
        this.createStatusBar('Hunger', startY + barSpacing, barWidth, barHeight, 0x66bb6a, 'hungerBar', 'hungerText');
        
        // Create sleep bar
        this.createStatusBar('Sleep', startY + (barSpacing * 2), barWidth, barHeight, 0xab47bc, 'sleepBar', 'sleepText');
        
        // Create toilet bar
        this.createStatusBar('Toilet', startY + (barSpacing * 3), barWidth, barHeight, 0xffa726, 'toiletBar', 'toiletText');
    }

    createStatusBar(label, y, width, height, color, barName, textName) {
        // Label
        const labelText = this.scene.add.text(
            GameConfig.SIDEBAR_MARGIN,
            y - 15,
            label + ':',
            {
                fontSize: '12px',
                fill: '#ffffff',
                fontFamily: 'monospace'
            }
        );
        this.elements.push(labelText);
        
        // Background bar
        const bgBar = this.scene.add.rectangle(
            GameConfig.SIDEBAR_MARGIN + width / 2,
            y + height / 2,
            width,
            height,
            0x333333
        );
        bgBar.setOrigin(0.5);
        this.elements.push(bgBar);
        
        // Foreground bar (status level)
        const fgBar = this.scene.add.rectangle(
            GameConfig.SIDEBAR_MARGIN,
            y,
            width,
            height,
            color
        );
        fgBar.setOrigin(0, 0);
        this[barName] = fgBar;
        this.elements.push(fgBar);
        
        // Percentage text
        const percentText = this.scene.add.text(
            GameConfig.SIDEBAR_MARGIN + width / 2,
            y + height / 2,
            '100%',
            {
                fontSize: '11px',
                fill: '#ffffff',
                fontFamily: 'monospace'
            }
        );
        percentText.setOrigin(0.5);
        this[textName] = percentText;
        this.elements.push(percentText);
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
        this.leftClickIcon = this.createMouseButton(controlsY, true);
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
        this.rightClickIcon = this.createMouseButton(rightClickY, false);
        this.elements.push(this.rightClickIcon);
        
        this.rightClickText = this.scene.add.text(
            GameConfig.SIDEBAR_MARGIN + 25,
            rightClickY + 2,
            "Select Player",
            GameConfig.SIDEBAR_CONTROLS_STYLE
        );
        this.elements.push(this.rightClickText);
    }

    createMouseButton(yPosition, isLeftButton) {
        const mouseIcon = this.scene.add.graphics();
        mouseIcon.fillStyle(0x94a3b8, 1);  // Light gray for mouse body
        mouseIcon.fillRoundedRect(GameConfig.SIDEBAR_MARGIN, yPosition, 18, 20, 3);
        mouseIcon.fillStyle(0x64b5f6, 1);  // Accent blue for active button
        
        const buttonX = isLeftButton ? GameConfig.SIDEBAR_MARGIN + 2 : GameConfig.SIDEBAR_MARGIN + 9;
        mouseIcon.fillRect(buttonX, yPosition + 2, 7, 10);
        mouseIcon.lineStyle(1, 0x2196f3, 1);  // Blue border
        mouseIcon.strokeRect(buttonX, yPosition + 2, 7, 10);
        
        return mouseIcon;
    }

    updatePlayer(_player)
    {
        this.player = _player;
        this.updateName()
        this.updatePosition();
        this.updateStatusBars();
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

    updateStatusBars() {
        const barWidth = GameConfig.TEXT_BOX_WIDTH - 40;  // Same as in createStatusBars
        
        if (!this.player) {
            // Set all bars to grey when no player selected
            const greyColor = 0x555555;
            
            if (this.thirstBar) {
                this.thirstBar.setFillStyle(greyColor);
                this.thirstBar.width = barWidth;
                this.thirstText.setText('--');
            }
            
            if (this.hungerBar) {
                this.hungerBar.setFillStyle(greyColor);
                this.hungerBar.width = barWidth;
                this.hungerText.setText('--');
            }
            
            if (this.sleepBar) {
                this.sleepBar.setFillStyle(greyColor);
                this.sleepBar.width = barWidth;
                this.sleepText.setText('--');
            }
            
            if (this.toiletBar) {
                this.toiletBar.setFillStyle(greyColor);
                this.toiletBar.width = barWidth;
                this.toiletText.setText('--');
            }
            
            return;
        }
        
        // Update thirst bar
        if (this.thirstBar) {
            this.thirstBar.setFillStyle(0x42a5f5);  // Restore original color
            const thirstWidth = (this.player.thirst / 100) * barWidth;
            this.thirstBar.width = thirstWidth;
            this.thirstText.setText(Math.floor(this.player.thirst) + '%');
        }
        
        // Update hunger bar
        if (this.hungerBar) {
            this.hungerBar.setFillStyle(0x66bb6a);  // Restore original color
            const hungerWidth = (this.player.hunger / 100) * barWidth;
            this.hungerBar.width = hungerWidth;
            this.hungerText.setText(Math.floor(this.player.hunger) + '%');
        }
        
        // Update sleep bar
        if (this.sleepBar) {
            this.sleepBar.setFillStyle(0xab47bc);  // Restore original color
            const sleepWidth = (this.player.sleep / 100) * barWidth;
            this.sleepBar.width = sleepWidth;
            this.sleepText.setText(Math.floor(this.player.sleep) + '%');
        }
        
        // Update toilet bar
        if (this.toiletBar) {
            this.toiletBar.setFillStyle(0xffa726);  // Restore original color
            const toiletWidth = (this.player.toilet / 100) * barWidth;
            this.toiletBar.width = toiletWidth;
            this.toiletText.setText(Math.floor(this.player.toilet) + '%');
        }
    }

    destroy() {
        this.elements.forEach(element => element.destroy());
        this.elements = [];
    }
} 