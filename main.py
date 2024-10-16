import pygame

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

# Main game loop
while running:
    # Time management
    dt = clock.tick(60) / 1000.0  # Convert to seconds

    # Event handling
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Input handling
    keys = pygame.key.get_pressed()
    is_walking = False
    if keys[pygame.K_a]:
        char_x = max(0, char_x - CHAR_SPEED * dt)
        facing_right = False
        is_walking = True
    if keys[pygame.K_d]:
        char_x = min(WINDOW_WIDTH - idle_frames[0].get_width(), char_x + CHAR_SPEED * dt)
        facing_right = True
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

    # Drawing
    screen.fill(BACKGROUND_COLOR)
    pygame.draw.rect(screen, GROUND_COLOR, (0, WINDOW_HEIGHT - GROUND_HEIGHT, WINDOW_WIDTH, GROUND_HEIGHT))
    pygame.draw.rect(screen, GRASS_COLOR, (0, WINDOW_HEIGHT - GROUND_HEIGHT - GRASS_HEIGHT, WINDOW_WIDTH, GRASS_HEIGHT))

    # Character rendering
    if is_walking:
        current_sprite = walk_frames[current_frame % len(walk_frames)]
    else:
        current_sprite = idle_frames[current_frame % len(idle_frames)]

    if not facing_right:
        current_sprite = pygame.transform.flip(current_sprite, True, False)
    screen.blit(current_sprite, (int(char_x), char_y))

    # Display update
    pygame.display.flip()

# Cleanup
pygame.quit()
