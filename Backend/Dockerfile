FROM node:20 AS builder
WORKDIR /app
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ARG REDIS_URL
ENV REDIS_URL=$REDIS_URL
COPY package*.json .
COPY ./prisma ./prisma
RUN npm install
# RUN npx prisma migrate dev
RUN npx prisma generate 
COPY . .

FROM node:20-slim
WORKDIR /app
COPY --from=builder /app .
RUN apt-get update -y && apt-get install -y openssl && apt-get install ffmpeg -y
EXPOSE 5000

CMD [ "npm", "run", "start" ]