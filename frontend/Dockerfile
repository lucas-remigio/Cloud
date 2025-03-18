# Use the official Node image as the build stage
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Production image stage
FROM node:18-alpine AS runner

# Set the working directory
WORKDIR /app

# Set environment variable to production
ENV NODE_ENV=production

# Copy necessary files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Expose the port Next.js listens on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]