FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./  
COPY ./prisma ./prisma
RUN npm ci 
RUN npx prisma generate 
COPY . .

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app .
EXPOSE 5000
CMD ["sh", "-c", "npx prisma migrate dev && npm run dev"]