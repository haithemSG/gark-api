FROM node:12

WORKDIR /usr/src/server

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "index.js"]
