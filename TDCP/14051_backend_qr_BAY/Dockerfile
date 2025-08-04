FROM --platform=linux/amd64 node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
run npm install

COPY . .
EXPOSE 15051
CMD [ "npm", "run", "start" ]