# Stage 1: Install dependencies and build the application
FROM oven/bun:latest AS builder
WORKDIR /app

# Copy package management files first for better caching
COPY package.json bun.lockb ./
RUN bun install

# Copy all project files and build
COPY . .
RUN bun run build

# Stage 2: Production environment
FROM oven/bun:latest AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lockb ./
COPY --from=builder /app/dist ./dist

# Install only production dependencies
RUN bun install --production

# Expose the default Vite/TanStack start port (typically 3000)
EXPOSE 3000

# Start the application
CMD ["bun", "run", "start"]
