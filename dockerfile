FROM node:20.3.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Ensure the correct permissions
RUN chown -R node:node /usr/src/app
USER node

CMD [ "npm", "run", "start:dev" ]