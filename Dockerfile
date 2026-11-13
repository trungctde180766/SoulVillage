# ==========================================
# Google Cloud Run Multi-Stage Dockerfile
# ==========================================

# Stage 1: Build client bundle
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Lightweight production container
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Cài đặt production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Sao chép bản build frontend và server runner
COPY --from=builder /app/dist ./dist
COPY server.js ./
COPY api ./api

# Cloud Run tự động inject biến PORT (mặc định 8080)
EXPOSE 8080

CMD ["node", "server.js"]

