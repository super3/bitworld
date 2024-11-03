import pygame
import random
import math

# Initialize Pygame
pygame.init()

# Display settings
WINDOW_WIDTH = 400
WINDOW_HEIGHT = 300
screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
pygame.display.set_caption("Simworld")

# Color definitions
BACKGROUND_COLOR = (142, 210, 255)  # #8ed2ff in RGB
GROUND_COLOR = (169, 87, 76)  # #a9574c in RGB
GRASS_COLOR = (48, 151, 108)  # #30976c in RGB

# Sprite settings
CHAR_SPRITE_WIDTH, CHAR_SPRITE_HEIGHT = 32, 32  # Character sprite size
INFRA_SPRITE_WIDTH, INFRA_SPRITE_HEIGHT = 16, 16  # Infrastructure sprite size
SCALE_FACTOR = 2

# Load and process sprite sheet
def load_sprite_frames(sprite_sheet, row, num_frames, sprite_width, sprite_height):
    frames = [
        sprite_sheet.subsurface(pygame.Rect(i * sprite_width, row * sprite_height, sprite_width, sprite_height))
        for i in range(num_frames)
    ]
    return [pygame.transform.scale(frame, (sprite_width * SCALE_FACTOR, sprite_height * SCALE_FACTOR)) for frame in frames]

def load_infrastructure_tile(sprite_sheet, row, col):
    tile = sprite_sheet.subsurface(pygame.Rect(
        col * INFRA_SPRITE_WIDTH, 
        row * INFRA_SPRITE_HEIGHT, 
        INFRA_SPRITE_WIDTH, 
        INFRA_SPRITE_HEIGHT
    ))
    return pygame.transform.scale(tile, (INFRA_SPRITE_WIDTH * SCALE_FACTOR, INFRA_SPRITE_HEIGHT * SCALE_FACTOR))

# Load sprite sheets
sprite_sheet = pygame.image.load("NPC/Male/NPC 1.png").convert_alpha()
infrastructure_sheet = pygame.image.load("World/Infrastructure.png").convert_alpha()

# Load character frames
idle_frames = load_sprite_frames(sprite_sheet, 1, 3, CHAR_SPRITE_WIDTH, CHAR_SPRITE_HEIGHT)
walk_frames = load_sprite_frames(sprite_sheet, 0, 4, CHAR_SPRITE_WIDTH, CHAR_SPRITE_HEIGHT)

# Infrastructure constants
INFRA_ROWS = 36
INFRA_COLS = 33

# Example of loading a specific infrastructure tile (row 0, col 0)
# You can load more tiles as needed using their row/col coordinates
example_tile = load_infrastructure_tile(infrastructure_sheet, 0, 0)

# Animation settings
IDLE_ANIMATION_SPEED = 3  # Frames per second
WALK_ANIMATION_SPEED = 8  # Frames per second

# Character settings
char_x = (WINDOW_WIDTH - idle_frames[0].get_width()) // 2
char_y = WINDOW_HEIGHT - idle_frames[0].get_height()
CHAR_SPEED = 100  # Pixels per second
CHAR_HEIGHT = 50  # Height of the character

# Environment settings
GROUND_HEIGHT = 13
GRASS_HEIGHT = 2

# Game state
running = True
clock = pygame.time.Clock()
current_frame = 0
animation_timer = 0
facing_right = True
is_walking = False

# Font settings
pygame.font.init()
FONT_SIZE = 20
font = pygame.font.Font(None, FONT_SIZE)

# Text box settings
TEXT_BOX_WIDTH = 200
TEXT_BOX_HEIGHT = WINDOW_HEIGHT
TEXT_BOX_X = WINDOW_WIDTH  # Changed from 0 to WINDOW_WIDTH
TEXT_BOX_Y = 0
TEXT_BOX_COLOR = (200, 200, 200)  # Light gray
TEXT_COLOR = (0, 0, 0)  # Black

# Adjust window size to include text box
TOTAL_WIDTH = WINDOW_WIDTH + TEXT_BOX_WIDTH
screen = pygame.display.set_mode((TOTAL_WIDTH, WINDOW_HEIGHT))
pygame.display.set_caption("Simworld")

# Player class
class Player:
    def __init__(self, first_name, last_name):
        self.first_name = first_name
        self.last_name = last_name
        self.x = WINDOW_WIDTH // 2
        self.y = WINDOW_HEIGHT - GROUND_HEIGHT - CHAR_HEIGHT
        self.facing_right = True
        self.speed = 100

    def update(self, dt):
        pass  # Removed hunger/thirst updates

# Initialize player
player = Player("John", "Sim")

# Main game loop
while running:
    # Time management
    dt = clock.tick(60) / 1000.0  # Delta time in seconds

    # Event handling
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    keys = pygame.key.get_pressed()
    is_walking = False

    if keys[pygame.K_a] or keys[pygame.K_d]:
        # Player-controlled movement (horizontal only)
        if keys[pygame.K_a]:
            player.x -= player.speed * dt
            player.facing_right = False
            is_walking = True
        elif keys[pygame.K_d]:
            player.x += player.speed * dt
            player.facing_right = True
            is_walking = True

    # Animation update
    current_speed = WALK_ANIMATION_SPEED if is_walking else IDLE_ANIMATION_SPEED
    animation_timer += clock.get_time()
    if animation_timer >= 1000 // current_speed:
        if is_walking:
            current_frame = (current_frame + 1) % len(walk_frames)
        else:
            current_frame = (current_frame + 1) % len(idle_frames)
        animation_timer = 0

    # Update player state
    player.update(dt)

    # Drawing
    screen.fill(BACKGROUND_COLOR)
    
    # Draw text box
    pygame.draw.rect(screen, TEXT_BOX_COLOR, (TEXT_BOX_X, TEXT_BOX_Y, TEXT_BOX_WIDTH, TEXT_BOX_HEIGHT))
    
    # Update text box content
    text_lines = [
        f"Name: {player.first_name} {player.last_name}",
        "",
        "Controls:",
        "A/D - Move left/right",
        "Esc - Quit"
    ]
    
    for i, line in enumerate(text_lines):
        text_surface = font.render(line, True, TEXT_COLOR)
        screen.blit(text_surface, (TEXT_BOX_X + 10, TEXT_BOX_Y + 10 + i * (FONT_SIZE + 5)))

    # Create a surface for the main game area
    game_surface = pygame.Surface((WINDOW_WIDTH, WINDOW_HEIGHT))
    game_surface.fill(BACKGROUND_COLOR)
    
    # Draw ground
    pygame.draw.rect(game_surface, GROUND_COLOR, (0, WINDOW_HEIGHT - GROUND_HEIGHT, WINDOW_WIDTH, GROUND_HEIGHT))
    
    # Draw grass
    pygame.draw.rect(game_surface, GRASS_COLOR, (0, WINDOW_HEIGHT - GROUND_HEIGHT - GRASS_HEIGHT, WINDOW_WIDTH, GRASS_HEIGHT))
    
    # Draw character on game surface
    if is_walking:
        current_sprite = walk_frames[current_frame % len(walk_frames)]
    else:
        current_sprite = idle_frames[current_frame % len(idle_frames)]
    if not player.facing_right:
        current_sprite = pygame.transform.flip(current_sprite, True, False)
    game_surface.blit(current_sprite, (int(player.x), int(player.y)))

    # Draw game surface on main screen
    screen.blit(game_surface, (0, 0))  # Changed from (TEXT_BOX_WIDTH, 0) to (0, 0)

    # Display update
    pygame.display.flip()

# Cleanup
pygame.quit()
