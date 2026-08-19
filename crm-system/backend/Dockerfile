FROM dhi.io/node:26-alpine

RUN apk add --no-cache curl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

RUN npx prisma generate

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]
