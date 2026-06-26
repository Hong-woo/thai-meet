FROM node:24-alpine

WORKDIR /app

ENV PRISMA_SKIP_POSTINSTALL_GENERATE=1

COPY package.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/api/prisma apps/api/prisma
COPY prisma.config.ts ./

RUN npm install \
  && npx prisma generate --config prisma.config.ts \
  && npm prune --omit=dev

COPY apps/api/src apps/api/src
COPY packages packages
COPY docs/dev docs/dev

ENV NODE_ENV=production
ENV API_PORT=3000

EXPOSE 3000

CMD ["node", "apps/api/src/server.mjs"]
