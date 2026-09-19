FROM node:22-alpine

RUN apk add --no-cache curl openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

RUN npx prisma generate

COPY . .

EXPOSE 3001

CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npm run dev"]
