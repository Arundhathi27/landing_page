# Use official Node.js LTS Alpine image (lightweight)
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (for better layer caching)
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the rest of the source code
COPY . .

# Expose backend port
EXPOSE 5001

# Start the server
CMD ["node", "server.js"]
