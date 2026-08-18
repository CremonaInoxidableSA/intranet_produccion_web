FROM node:20-alpine AS builder

WORKDIR /app

ENV npm_config_legacy_peer_deps=true

COPY package*.json ./

RUN npm ci --force

COPY . .

RUN npm run build

FROM node:20-alpine

ENV NODE_ENV=production
ENV TZ=America/Argentina/Buenos_Aires

WORKDIR /app

ENV npm_config_legacy_peer_deps=true

COPY package*.json ./

RUN npm ci --force

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3200

CMD ["npm", "start"]