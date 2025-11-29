# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages
RUN npm install

# Bundle app source
COPY . .

# Build the app
RUN npm run build

# Your app binds to port 8080 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
ENV PORT=8080
EXPOSE 8080

# Define the command to run your app
CMD [ "npm", "run", "server" ]