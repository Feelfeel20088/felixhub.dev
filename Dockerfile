FROM node:latest

WORKDIR /app


COPY package*.json ./

RUN npm install --production


COPY . .


EXPOSE 8080


CMD ["npm", "start"]
