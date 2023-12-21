FROM node:18-alpine

# Installs latest Chromium (100) package.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Add user so we don't need --no-sandbox.
# Add user so we don't need --no-sandbox.
RUN addgroup -S pptruser \
    && addgroup node pptruser \
    && mkdir -p /home/node/Downloads /app \
    && chown -R node:pptruser /home/node \
    && chown -R node:pptruser /app

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 3000

CMD ["npm", "run", "start"]
