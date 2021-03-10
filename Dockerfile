FROM node:14.15.4-alpine3.12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 4000

RUN npm run manifest

CMD [ "npm", "start" ]
