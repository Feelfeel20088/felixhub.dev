# Use the official Node.js image as a base
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose the port the app will run on (default Fastify port is 3000)
EXPOSE 8080

# Command to run the app
CMD ["npm", "start"]
