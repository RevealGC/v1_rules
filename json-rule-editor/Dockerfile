FROM node:18.4.0

# Download and install OpenSSL 1.1.0f
RUN apt-get update && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./

# Install app dependencies
RUN npm i --legacy-peer-deps

COPY . .

# RUN yarn build

EXPOSE 3000

CMD [ "npm", "start"]
# CMD [ "cd", "dist", "&&", "serve", "-s", "build" ]