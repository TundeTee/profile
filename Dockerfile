# Multi-stage build: build frontend and run Node backend

FROM node:20 AS builder
WORKDIR /app

# Install root deps
COPY package*.json ./
RUN npm install

# Copy frontend sources and install/build
COPY frontend ./frontend
RUN npm install --prefix frontend && npm run build --prefix frontend

# Copy backend sources
COPY backend ./backend

# Runtime image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install only production deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy built artifacts and backend into runtime
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/frontend/dist ./frontend/dist

# Expose port
EXPOSE 5000

# Default uploads directory inside container (can override with UPLOAD_DIR env)
ENV UPLOAD_DIR=/app/backend/uploads

# Start server
CMD ["node", "backend/server.js"]