FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY backend ./backend
COPY server.js ./

EXPOSE 5001

CMD ["npm", "start"]
