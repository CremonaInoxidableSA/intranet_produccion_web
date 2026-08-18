FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force && npm install --prefer-offline --no-audit

COPY . .

RUN npm run build

FROM node:20-alpine

ENV NODE_ENV=production
ENV TZ=America/Argentina/Buenos_Aires

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force && npm install --prefer-offline --no-audit

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3200

CMD ["npm", "start"]