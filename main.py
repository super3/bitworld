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
SPRITE_WIDTH, SPRITE_HEIGHT = 32, 32
SCALE_FACTOR = 2

# Load and process sprite sheet
def load_sprite_frames(sprite_sheet, row, num_frames):
    frames = [
        sprite_sheet.subsurface(pygame.Rect(i * SPRITE_WIDTH, row * SPRITE_HEIGHT, SPRITE_WIDTH, SPRITE_HEIGHT))
        for i in range(num_frames)
    ]
    return [pygame.transform.scale(frame, (SPRITE_WIDTH * SCALE_FACTOR, SPRITE_HEIGHT * SCALE_FACTOR)) for frame in frames]

sprite_sheet = pygame.image.load("NPC/Male/NPC 1.png").convert_alpha()
idle_frames = load_sprite_frames(sprite_sheet, 1, 3)
walk_frames = load_sprite_frames(sprite_sheet, 0, 4)

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
        self.hunger = 0  # 0 is not hungry, 100 is starving
        self.thirst = 0  # 0 is not thirsty, 100 is very thirsty
        self.money = 100  # Starting money
        self.x = WINDOW_WIDTH // 2
        self.y = WINDOW_HEIGHT - GROUND_HEIGHT - CHAR_HEIGHT + 15  # Adjusted y position
        self.facing_right = True
        self.inventory = []
        self.target_apple = None
        self.speed = 100  # Pixels per second, adjust as needed
        self.y = WINDOW_HEIGHT - GROUND_HEIGHT - CHAR_HEIGHT  # Set initial y position on the ground

    def find_nearest_apple(self, apples):
        if not apples:
            return None
        return min(apples, key=lambda apple: abs(apple[0] - self.x))

    def move_towards_apple(self, apples, dt):
        if self.hunger <= 1:
            self.target_apple = None
            return False

        self.target_apple = self.find_nearest_apple(apples)
        
        if self.target_apple:
            dx = self.target_apple[0] - self.x
            distance = abs(dx)
            
            if distance < 5:  # If close enough to pick up
                self.inventory.append(self.target_apple)
                apples.remove(self.target_apple)
                self.target_apple = None
                self.hunger = max(0, self.hunger - 10)  # Decrease hunger when apple is eaten
                return False
            else:
                # Move towards the apple (horizontally only)
                move_distance = min(self.speed * dt, distance)
                self.x += move_distance if dx > 0 else -move_distance
                self.facing_right = dx > 0
                return True
        return False

    def update(self, dt):
        self.hunger += 0.1 * dt  # Increased much more slowly
        self.hunger = min(self.hunger, 100)  # Cap hunger at 100

# Initialize player
player = Player("John", "Sim")

# Load apple image
apple_image = pygame.image.load("World/Apple.png").convert_alpha()
apple_image = pygame.transform.scale(apple_image, (15, 15))  # Smaller size

# Assuming you have a GROUND_HEIGHT constant defined somewhere
# If not, add this line (adjust the value as needed):
# GROUND_HEIGHT = 50  # Height of the ground from the bottom of the screen

# Calculate the y-coordinate for apples
APPLE_Y = WINDOW_HEIGHT - GROUND_HEIGHT - 15 - 2  # Place apples just above the ground and 2 pixels up

# Function to generate random apple positions
def generate_apples(num_apples):
    return [(random.randint(0, WINDOW_WIDTH - 15), APPLE_Y) 
            for _ in range(num_apples)]

# Generate initial apples (only once, before the game loop)
apples = generate_apples(5)  # 5 apples, generated once

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

    if any([keys[pygame.K_LEFT], keys[pygame.K_RIGHT], keys[pygame.K_a], keys[pygame.K_d]]):
        # Player-controlled movement (horizontal only)
        if keys[pygame.K_LEFT] or keys[pygame.K_a]:
            player.x -= player.speed * dt
            player.facing_right = False
            is_walking = True
        elif keys[pygame.K_RIGHT] or keys[pygame.K_d]:
            player.x += player.speed * dt
            player.facing_right = True
            is_walking = True
    elif player.hunger > 1:
        # Automatic movement towards nearest apple if hungry
        is_walking = player.move_towards_apple(apples, dt)

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
        f"Hunger: {player.hunger:.1f}",
        f"Thirst: {player.thirst:.1f}",
        f"Money: ${player.money:.2f}",
        f"Apples: {len(player.inventory)}",
        "",
        "Controls:",
        "Arrow keys - Move",
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
    
    # Draw apples
    for apple_pos in apples:
        game_surface.blit(apple_image, apple_pos)

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
