FROM node:18-alpine

RUN apk add --no-cache bash

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY src/ src/

# Copy wait-for-it.sh into /usr/local/bin/ and make it executable
COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

# Expose port (if needed)
EXPOSE 3000

CMD [ "npm", "start" ]