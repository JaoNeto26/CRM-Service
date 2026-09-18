FROM node:22-alpine

RUN apk add --no-cache curl openssl
RUN npm install --global npm@12.0.2

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

RUN npx prisma generate

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]
