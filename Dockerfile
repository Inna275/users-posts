FROM node:25-bullseye-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD npx prisma generate && npx prisma migrate deploy && npm start
