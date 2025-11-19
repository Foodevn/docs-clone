# ---------- STAGE 1: Build ----------
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package và cài dependencies
# COPY package*.json ./
# RUN npm ci --legacy-peer-deps

# Copy toàn bộ source code
COPY . .

COPY .env.production .env.production

# Build dự án Next.js
RUN npm run build

# ---------- STAGE 2: Run ----------
FROM node:18-alpine AS runner
WORKDIR /app

# Copy kết quả build từ stage 1
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Thiết lập biến môi trường (nếu có)
# ENV NODE_ENV=production
# ENV LIVEBLOCKS_SECRET_KEY=sk_dev_kJrjWGDvpd5y2kMICG6ER9Ly703lOwxPummaGeG3nvaaOBqIR0s2C99XIMigvP_J

EXPOSE 3000

# Chạy ứng dụng
CMD ["npm", "run", "start"]