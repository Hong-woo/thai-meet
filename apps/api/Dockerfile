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
RUN mkdir -p ThaiMeet_BrandPackage
COPY thai-meet-mobile-phone-frame.png ./
COPY ["ThaiMeet_BrandPackage/ThaiMeet logo clean.png", "ThaiMeet_BrandPackage/ThaiMeet logo clean.png"]
COPY ["ThaiMeet_BrandPackage/ThaiMeet monogram clean.png", "ThaiMeet_BrandPackage/ThaiMeet monogram clean.png"]
COPY ["ThaiMeet_BrandPackage/ThaiMeet_BrandPackage.png", "ThaiMeet_BrandPackage/ThaiMeet_BrandPackage.png"]

ENV NODE_ENV=production
ENV API_PORT=3000

EXPOSE 3000

CMD ["node", "apps/api/src/server.mjs"]
