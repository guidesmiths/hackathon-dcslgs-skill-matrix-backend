FROM node:14.15.4-alpine3.12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# In order to run node alpine image avoiding Python error
RUN apk --no-cache add --virtual builds-deps build-base python3

# Install Git to prevent "Error: spawn git ENOENT" in alpine image
RUN apk add --no-cache git

RUN npm install --quiet

# Bundle app source
COPY . .

EXPOSE 4000

# Generate project's documentation
RUN npm run create-jsdoc-docs

RUN npm run manifest

CMD [ "npm", "start" ]