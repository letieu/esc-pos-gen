# ESC/POS Commands generator from html link

## Usage

```bash
# Build the image
docker build -t letieu/escgen:1.0 .

# Run the image
docker run --name escgen -p 3001:3000 -d letieu/escgen:1.0
