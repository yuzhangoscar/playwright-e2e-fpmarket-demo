# Use the official Playwright image with all browsers pre-installed
FROM mcr.microsoft.com/playwright:v1.41.0-focal

# Set working directory
WORKDIR /app

# Set environment variables
ENV CI=true
ENV NODE_ENV=test

# Copy package files
COPY package*.json ./

# Install dependencies (skip postinstall scripts for Docker)
RUN npm ci --ignore-scripts

# Copy source code
COPY . .

# Install Playwright browsers (they should already be in the base image)
RUN npx playwright install --with-deps

# Create reports directory
RUN mkdir -p test-results playwright-report

# Default command to run tests
CMD ["npm", "test"]

# Expose port for report server (optional)
EXPOSE 9323