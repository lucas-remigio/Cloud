FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY index.js ./

# Expose port (if needed)
EXPOSE 3002

CMD [ "node", "index.js" ]