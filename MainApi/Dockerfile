# Base image
FROM node:14-alpine

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install

# Build
RUN yarn build

# Copy application code
COPY . .

# Expose port (change it if your Nest.js app is running on a different port)
EXPOSE 3000

# Run the application
CMD ["yarn", "start:prod"]
