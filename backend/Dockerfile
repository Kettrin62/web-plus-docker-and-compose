FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Устанавливаем зависимости
RUN npm ci
# Копируем исходный код и собираем приложение
COPY . .
RUN npm run build

FROM node:16-alpine AS production
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm i -g pm2 \
  && npm i --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/ecosystem.config.js ./ecosystem.config.js

EXPOSE 3000
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
