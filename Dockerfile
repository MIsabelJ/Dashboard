FROM node:18.20.2-alpine3.19

WORKDIR /App
COPY . .
RUN npm install

CMD ["npm", "run", "dev", "--", "--host"]