FROM node:20.3.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN chown -R node:node /usr/src/app

RUN chown -R node:node /usr/local/lib/node_modules

USER node

CMD [ "npm", "run", "start:dev" ]