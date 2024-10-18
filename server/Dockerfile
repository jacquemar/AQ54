FROM node:18-alpine
RUN apk add --no-cache make gcc g++ python3
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

RUN npm rebuild bcrypt

ENV PORT=3000

EXPOSE 3000

# Lancer l'application en mode production
CMD ["npm", "run", "start"]
