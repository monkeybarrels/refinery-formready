# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json only (not package-lock.json)
# The lock file generated on macOS doesn't include alpine/musl native bindings
# for oxc-parser (npm bug: https://github.com/npm/cli/issues/4828)
COPY package.json ./

# Install dependencies fresh to get correct native bindings for alpine
RUN npm install

# Copy source code
COPY . .

# Build the Nuxt app
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built application from builder
COPY --from=builder /app/.output ./.output

# Set production environment
ENV NODE_ENV=production

# Expose port (Railway will set PORT env var)
EXPOSE 3000

# Start the Nuxt server
CMD ["node", ".output/server/index.mjs"]
