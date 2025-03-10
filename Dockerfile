# Use Node.js 23 slim as base image (recommended by Docker Scout)
FROM node:23-slim

# Set working directory in the container
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy only the TypeScript config and source files
COPY tsconfig.json ./
COPY src/ ./src/

# Build TypeScript code
RUN npm run build

# Default command that will show usage information
CMD ["sh", "-c", "echo \"Usage: docker run --rm -v $(pwd):/app trusted-setup [contribute|verify]\" && echo \"  - contribute: Run the contribution process\" && echo \"  - verify: Run the verification process\""]

ENTRYPOINT ["npm", "run"]