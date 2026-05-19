FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build step if needed, here we'll just run ts-node directly or build to JS.
RUN npm run build --if-present

EXPOSE 5001

CMD ["npm", "start"]
