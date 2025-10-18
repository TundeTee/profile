# Multi-stage build: build frontend and run Node backend

FROM node:20 AS builder
WORKDIR /app

# Install root deps and frontend deps
COPY package*.json ./
COPY frontend/package*.json ./frontend/
RUN npm install && npm install --prefix frontend

# Copy source and build frontend
COPY . .
RUN npm run build --prefix frontend

# Runtime image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install only production deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy built app
COPY --from=builder /app .

# Expose port
EXPOSE 5000

# Default uploads directory inside container (can override with UPLOAD_DIR env)
ENV UPLOAD_DIR=/app/backend/uploads

# Start server
CMD ["node", "backend/server.js"]