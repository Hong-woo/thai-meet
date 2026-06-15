FROM node:24-alpine

WORKDIR /app

COPY package.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/api/src apps/api/src
COPY packages packages
COPY docs/dev docs/dev

ENV NODE_ENV=production
ENV API_PORT=3000

EXPOSE 3000

CMD ["node", "apps/api/src/server.mjs"]
