#!/bin/bash

# Create directory for temporary files
mkdir -p temp

# Define optional colors
BACKGROUND_COLOR="#4f46e5"      # Primary color
DARK_BACKGROUND_COLOR="#1e1b4b" # Darker shade for better contrast

# Process the colored logo for transparent favicons (using colored logo)
convert public/logo-colored.svg -resize 16x16 public/favicons/favicon-16x16.png
convert public/logo-colored.svg -resize 32x32 public/favicons/favicon-32x32.png
convert public/logo-colored.svg -resize 192x192 public/favicons/favicon-192x192.png
convert public/logo-colored.svg -resize 512x512 public/favicons/favicon-512x512.png

# Create favicon.ico (multi-size icon)
convert public/favicons/favicon-16x16.png public/favicons/favicon-32x32.png public/favicons/favicon.ico

# Create a circular background with gradient for maskable icons
convert -size 1024x1024 \
  gradient:"$DARK_BACKGROUND_COLOR-$BACKGROUND_COLOR" \
  -gravity center -crop 1024x1024+0+0 +repage \
  temp/background-gradient.png

# Process the colored logo for maskable icons (using colored logo)
convert public/logo-colored.svg -resize 720x720 -background none temp/logo-colored.png

# Add padding to ensure safe zone for maskable icons
convert temp/background-gradient.png \
  temp/logo-colored.png -gravity center -composite \
  temp/maskable-icon.png

# Create maskable icons
convert temp/maskable-icon.png -resize 192x192 public/favicons/favicon-192x192-maskable.png
convert temp/maskable-icon.png -resize 512x512 public/favicons/favicon-512x512-maskable.png

# Create Apple touch icon with rounded corners
convert temp/maskable-icon.png -resize 180x180 \
  \( +clone -alpha extract -draw 'fill black polygon 0,0 0,15 15,0 fill white circle 15,15 15,0' \
  \( +clone -flip \) -compose Multiply -composite \
  \( +clone -flop \) -compose Multiply -composite \
  \) -alpha off -compose CopyOpacity -composite public/favicons/apple-touch-icon.png

# Clean up
rm -rf temp

# Remove unnecessary favicon sizes
rm -f public/favicons/favicon-48x48.png
rm -f public/favicons/favicon-64x64.png
rm -f public/favicons/favicon-128x128.png
rm -f public/favicons/favicon-256x256.png
rm -f public/favicons/favicon-384x384.png

echo "Enhanced favicons generated successfully!"
