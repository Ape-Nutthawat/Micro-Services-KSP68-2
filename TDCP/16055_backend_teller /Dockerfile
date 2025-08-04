FROM --platform=linux/amd64 node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
Run npm install

COPY . .
EXPOSE 17055
CMD [ "npm", "run", "start" ]