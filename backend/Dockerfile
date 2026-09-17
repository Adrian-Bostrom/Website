FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY backend ./backend
COPY data ./data

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_PATH=/app/data/website.sqlite

EXPOSE 3000

CMD ["node", "backend/server.js"]
