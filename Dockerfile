FROM node:14.15.4-alpine3.12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 4000

# Generate project's documentation
RUN npm run create-asyncapi-docs

RUN npm run manifest

CMD [ "npm", "start" ]