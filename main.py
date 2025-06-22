import pygame

class GameConfig:
    """
    Static configuration class that holds all game constants and settings.
    This centralized approach makes it easier to modify game parameters.
    """
    # Display settings
    WINDOW_WIDTH = 800  # Width of the main game window
    WINDOW_HEIGHT = 600  # Height of the main game window
    TEXT_BOX_WIDTH = 200  # Width of the side panel text box
    TOTAL_WIDTH = WINDOW_WIDTH + TEXT_BOX_WIDTH  # Total window width including text box
    
    # Color definitions in RGB format
    BACKGROUND_COLOR = (142, 210, 255)  # Light blue sky
    GROUND_COLOR = (169, 87, 76)  # Brown earth
    GRASS_COLOR = (48, 151, 108)  # Green grass
    TEXT_BOX_COLOR = (200, 200, 200)  # Light gray
    TEXT_COLOR = (0, 0, 0)  # Black text
    
    # Character sprite settings
    SPRITE_WIDTH = 32  # Width of a single sprite frame
    SPRITE_HEIGHT = 32  # Height of a single sprite frame
    SCALE_FACTOR = 2  # Scaling factor for sprites
    CHAR_SPEED = 100  # Character movement speed (pixels per second)
    
    # Animation timing settings
    IDLE_ANIMATION_SPEED = 3  # Frames per second when idle
    WALK_ANIMATION_SPEED = 8  # Frames per second when walking
    
    # Environment dimensions
    GROUND_HEIGHT = 13  # Height of the ground layer
    GRASS_HEIGHT = 2  # Height of the grass layer
    
    # UI settings
    FONT_SIZE = 20  # Size of the font in pixels
    
    # Building settings
    BUILDING_WIDTH = 288  # Original width of building sprites
    BUILDING_HEIGHT = 48  # Original height of building sprites
    BUILDING_SCALE = 2  # Scale factor for building sprites

class SpriteLoader:
    """
    Utility class for loading and processing sprite sheets.
    Handles the loading, splitting, and scaling of sprite animations.
    """
    @staticmethod
    def load_frames(sprite_sheet, row, num_frames, width, height, scale):
        """
        Loads and processes sprite frames from a sprite sheet.
        
        Args:
            sprite_sheet (Surface): The loaded sprite sheet image
            row (int): Which row to load from the sprite sheet
            num_frames (int): Number of frames to load
            width (int): Width of each sprite frame
            height (int): Height of each sprite frame
            scale (int): Scaling factor for the sprites
            
        Returns:
            list: List of scaled sprite frame surfaces
        """
        # Extract individual frames from the sprite sheet
        frames = [
            sprite_sheet.subsurface(pygame.Rect(i * width, row * height, width, height))
            for i in range(num_frames)
        ]
        # Scale each frame to the desired size
        return [pygame.transform.scale(frame, (width * scale, height * scale)) 
                for frame in frames]

class Player:
    """
    Player class representing the game character.
    Handles player state, movement, and attributes.
    """
    def __init__(self, first_name, last_name, x, y):
        """
        Initialize a new player character.
        
        Args:
            first_name (str): Player's first name
            last_name (str): Player's last name
            x (int): Initial x position
            y (int): Initial y position
        """
        self.first_name = first_name
        self.last_name = last_name
        self.x = x
        self.y = y
        self.facing_right = True  # Direction player is facing
        self.speed = GameConfig.CHAR_SPEED
        self.is_walking = False  # Current movement state

    def move(self, direction, dt):
        """
        Move the player in the specified direction.
        
        Args:
            direction (int): -1 for left, 1 for right
            dt (float): Delta time for frame-independent movement
        """
        self.is_walking = True
        self.facing_right = (direction > 0)
        self.x += direction * self.speed * dt

class Game:
    """
    Main game class that handles initialization, game loop, and rendering.
    Coordinates all game systems and manages the main update loop.
    """
    def __init__(self):
        """Initialize the game, set up display, and load resources."""
        # Initialize Pygame modules
        pygame.init()
        pygame.font.init()
        
        # Set up display
        self.screen = pygame.display.set_mode((GameConfig.TOTAL_WIDTH, GameConfig.WINDOW_HEIGHT))
        pygame.display.set_caption("Simworld")
        
        # Initialize timing and font
        self.clock = pygame.time.Clock()
        self.font = pygame.font.Font(None, GameConfig.FONT_SIZE)
        
        # Load and process sprite sheets
        sprite_sheet = pygame.image.load("NPC/Male/NPC 1.png").convert_alpha()
        self.idle_frames = SpriteLoader.load_frames(
            sprite_sheet, 1, 3, 
            GameConfig.SPRITE_WIDTH, GameConfig.SPRITE_HEIGHT, 
            GameConfig.SCALE_FACTOR
        )
        self.walk_frames = SpriteLoader.load_frames(
            sprite_sheet, 0, 4, 
            GameConfig.SPRITE_WIDTH, GameConfig.SPRITE_HEIGHT, 
            GameConfig.SCALE_FACTOR
        )
        
        # Initialize game state and player
        self.player = Player(
            "John", "Sim",
            GameConfig.WINDOW_WIDTH // 2,  # Center horizontally
            GameConfig.WINDOW_HEIGHT - GameConfig.GROUND_HEIGHT - 
            (GameConfig.SPRITE_HEIGHT * GameConfig.SCALE_FACTOR) + 15  # Position above ground
        )
        self.current_frame = 0  # Current animation frame
        self.animation_timer = 0  # Timer for animation updates
        
        # Load building sprites (bottom to top)
        building_sprites = [
            "world/apartment_lobby.png",
            "world/apartment_design1.png",
            "world/apartment_design2.png",
            "world/apartment_design3.png",
            "world/apartment_roof.png"  # Added roof sprite
        ]
        
        # Scale the building sprites
        scaled_width = GameConfig.BUILDING_WIDTH * GameConfig.BUILDING_SCALE
        scaled_height = GameConfig.BUILDING_HEIGHT * GameConfig.BUILDING_SCALE
        
        # Load and scale all building sprites
        self.building_sprites = []
        for sprite_path in building_sprites:
            sprite = pygame.image.load(sprite_path).convert_alpha()
            scaled_sprite = pygame.transform.scale(sprite, (scaled_width, scaled_height))
            self.building_sprites.append(scaled_sprite)
        
        # Calculate building positions (centered horizontally, stacked vertically)
        self.building_x = (GameConfig.WINDOW_WIDTH - scaled_width) // 2
        self.building_positions = []
        
        # Calculate positions for each floor (bottom to top)
        for i in range(len(building_sprites)):  # Now includes roof
            y_pos = (GameConfig.WINDOW_HEIGHT - GameConfig.GROUND_HEIGHT - 
                    scaled_height * (i + 1))
            self.building_positions.append((self.building_x, y_pos))
        
    def handle_input(self, dt):
        """
        Process keyboard input and update player state.
        
        Args:
            dt (float): Delta time for frame-independent movement
        """
        keys = pygame.key.get_pressed()
        self.player.is_walking = False
        
        # Check for escape key to quit
        if keys[pygame.K_ESCAPE]:
            pygame.event.post(pygame.event.Event(pygame.QUIT))
        
        # Handle movement keys
        if keys[pygame.K_a]:  # Move left
            self.player.move(-1, dt)
        elif keys[pygame.K_d]:  # Move right
            self.player.move(1, dt)

    def update_animation(self):
        """Update the animation frame based on the player's state."""
        # Determine animation speed based on movement state
        current_speed = (GameConfig.WALK_ANIMATION_SPEED 
                        if self.player.is_walking 
                        else GameConfig.IDLE_ANIMATION_SPEED)
        
        # Update animation frame when timer exceeds frame duration
        self.animation_timer += self.clock.get_time()
        if self.animation_timer >= 1000 // current_speed:
            frames = self.walk_frames if self.player.is_walking else self.idle_frames
            self.current_frame = (self.current_frame + 1) % len(frames)
            self.animation_timer = 0

    def draw(self):
        """Handle all drawing operations for the game."""
        # Create and fill the main game surface
        game_surface = pygame.Surface((GameConfig.WINDOW_WIDTH, GameConfig.WINDOW_HEIGHT))
        game_surface.fill(GameConfig.BACKGROUND_COLOR)
        
        # Draw environment (ground and grass)
        pygame.draw.rect(game_surface, GameConfig.GROUND_COLOR, 
                        (0, GameConfig.WINDOW_HEIGHT - GameConfig.GROUND_HEIGHT, 
                         GameConfig.WINDOW_WIDTH, GameConfig.GROUND_HEIGHT))
        
        pygame.draw.rect(game_surface, GameConfig.GRASS_COLOR,
                        (0, GameConfig.WINDOW_HEIGHT - GameConfig.GROUND_HEIGHT - GameConfig.GRASS_HEIGHT,
                         GameConfig.WINDOW_WIDTH, GameConfig.GRASS_HEIGHT))
        
        # Draw building (bottom to top)
        for sprite, pos in zip(self.building_sprites, self.building_positions):
            game_surface.blit(sprite, pos)
        
        # Draw character
        frames = self.walk_frames if self.player.is_walking else self.idle_frames
        current_sprite = frames[self.current_frame % len(frames)]
        if not self.player.facing_right:
            current_sprite = pygame.transform.flip(current_sprite, True, False)
        game_surface.blit(current_sprite, (int(self.player.x), int(self.player.y)))
        
        # Compose final screen
        self.screen.fill(GameConfig.BACKGROUND_COLOR)
        self.screen.blit(game_surface, (0, 0))
        self.draw_text_box()
        
        pygame.display.flip()

    def draw_text_box(self):
        """Draw the information panel on the right side of the screen."""
        # Draw text box background
        pygame.draw.rect(self.screen, GameConfig.TEXT_BOX_COLOR, 
                        (GameConfig.WINDOW_WIDTH, 0, 
                         GameConfig.TEXT_BOX_WIDTH, GameConfig.WINDOW_HEIGHT))
        
        # Prepare and render text lines
        text_lines = [
            f"Name: {self.player.first_name} {self.player.last_name}",
            "",
            "Controls:",
            "A/D - Move left/right",
            "Esc - Quit"
        ]
        
        # Draw each line of text
        for i, line in enumerate(text_lines):
            text_surface = self.font.render(line, True, GameConfig.TEXT_COLOR)
            self.screen.blit(text_surface, 
                           (GameConfig.WINDOW_WIDTH + 10, 
                            10 + i * (GameConfig.FONT_SIZE + 5)))

    def run(self):
        """Main game loop."""
        running = True
        while running:
            # Calculate delta time for frame-independent movement
            dt = self.clock.tick(60) / 1000.0
            
            # Handle events
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False
            
            # Update game state
            self.handle_input(dt)
            self.update_animation()
            self.draw()

        pygame.quit()

if __name__ == "__main__":
    game = Game()
    game.run()
