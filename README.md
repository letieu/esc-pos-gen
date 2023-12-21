# ESC/POS Commands generator from html link

## Usage

```bash
# Build the image
docker build -t letieu/escgen:1.0 .

# Run the image on mac M1
docker run --name escgen -p 3001:3000 --restart=always -d letieu/escgen:1.0

# Run the image on AMD64
docker run --name escgen -p 3001:3000 -d letieu/escgen:1.0-amd64
