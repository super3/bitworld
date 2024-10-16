import pygame

# Initialize Pygame
pygame.init()

# Set up the display
width, height = 400, 300
screen = pygame.display.set_mode((width, height))
pygame.display.set_caption("Simworld")

# Load the sprite sheet
sprite_sheet = pygame.image.load("NPC 1.png").convert_alpha()

# Extract the idle and walk animation frames (assuming 32x32 pixel sprites)
sprite_width, sprite_height = 32, 32
idle_frames = [
    sprite_sheet.subsurface(pygame.Rect(i * sprite_width, sprite_height, sprite_width, sprite_height))
    for i in range(3)
]
walk_frames = [
    sprite_sheet.subsurface(pygame.Rect(i * sprite_width, 0, sprite_width, sprite_height))
    for i in range(4)
]

# Scale the sprites
scale_factor = 2
idle_frames = [pygame.transform.scale(frame, (sprite_width * scale_factor, sprite_height * scale_factor)) for frame in idle_frames]
walk_frames = [pygame.transform.scale(frame, (sprite_width * scale_factor, sprite_height * scale_factor)) for frame in walk_frames]

# Animation variables
current_frame = 0
animation_speed = 3  # Frames per second for idle animation
walk_animation_speed = 8  # Frames per second for walk animation
animation_timer = 0

# Character position, movement, and direction
char_x = (width - idle_frames[0].get_width()) // 2
char_y = height - idle_frames[0].get_height() + 16
char_speed = 100  # Pixels per second
facing_right = True
is_walking = False

# Main game loop
running = True
clock = pygame.time.Clock()
while running:
    # Calculate delta time
    dt = clock.tick(60) / 1000.0  # Convert to seconds

    # Event handling
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Handle continuous key presses
    keys = pygame.key.get_pressed()
    is_walking = False
    if keys[pygame.K_a]:
        char_x = max(0, char_x - char_speed * dt)
        facing_right = False  # Update direction when moving left
        is_walking = True
    if keys[pygame.K_d]:
        char_x = min(width - idle_frames[0].get_width(), char_x + char_speed * dt)
        facing_right = True  # Update direction when moving right
        is_walking = True

    # Update animation
    current_speed = walk_animation_speed if is_walking else animation_speed
    animation_timer += clock.get_time()
    if animation_timer >= 1000 // current_speed:
        if is_walking:
            current_frame = (current_frame + 1) % len(walk_frames)
        else:
            current_frame = (current_frame + 1) % len(idle_frames)
        animation_timer = 0

    # Fill the screen with white color
    screen.fill((255, 255, 255))

    # Get the current frame and flip it if facing left
    if is_walking:
        current_sprite = walk_frames[current_frame % len(walk_frames)]
    else:
        current_sprite = idle_frames[current_frame % len(idle_frames)]
    if not facing_right:
        current_sprite = pygame.transform.flip(current_sprite, True, False)

    # Draw the current frame
    screen.blit(current_sprite, (int(char_x), char_y))

    # Update the display
    pygame.display.flip()

# Quit Pygame
pygame.quit()
