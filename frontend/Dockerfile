# Use official Node.js LTS Alpine image (lightweight)
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first (for better layer caching)
COPY package*.json ./

# Install all dependencies (including devDependencies for Vite)
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start Vite dev server, binding to all interfaces so it's reachable from host
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
