FROM node:18-alpine

ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev > /dev/null 2>&1

WORKDIR /opt/app

COPY package*.json ./

COPY . .
RUN npm ci --only=production

RUN npm run build

EXPOSE 1337

CMD ["npm", "start"]