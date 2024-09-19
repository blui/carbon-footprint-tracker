# Dockerfile

# Use the official Node.js 14 image as the base image for the container
FROM node:14

# Set the working directory inside the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json to the container
# This allows us to cache the npm install step if dependencies haven't changed
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the remaining application code to the working directory inside the container
COPY . .

# Expose port 3000 for communication between the container and the host machine
EXPOSE 3000

# Command to run the application inside the container
CMD ["npm", "start"]
