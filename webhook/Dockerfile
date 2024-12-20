FROM node:18-alpine

WORKDIR /opt/app

COPY package*.json ./

COPY . .
RUN npm install express

EXPOSE 4000

CMD ["node", "index.js"]