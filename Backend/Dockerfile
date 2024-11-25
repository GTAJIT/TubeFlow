FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY ./prisma ./prisma
RUN npm ci
RUN npx prisma generate
COPY . .

FROM node:20-alpine
WORKDIR /app
RUN apk update && apk add --no-cache redis
COPY --from=builder /app .

EXPOSE 5000
CMD ["npm", "run", "dev"]
