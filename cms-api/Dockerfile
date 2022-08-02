FROM node:16
WORKDIR /app
ADD . /app
RUN npm install && npm run build
CMD node build/index.js