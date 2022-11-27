FROM node:16-alpine AS development

WORKDIR /usr/src/app

ENV CHROME_BIN="/usr/bin/chromium-browser" \
  PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

RUN apk update && apk add --no-cache nmap && \
  echo @edge http://dl-cdn.alpinelinux.org/alpine/latest-stable/community >> /etc/apk/repositories && \
  echo @edge http://dl-cdn.alpinelinux.org/alpine/latest-stable/main >> /etc/apk/repositories && \
  apk update && \
  apk add --no-cache \
  chromium

COPY package*.json ./

RUN npm ci

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:16-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ENV CHROME_BIN="/usr/bin/chromium-browser" \
  PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

RUN apk update && apk add --no-cache nmap && \
  echo @edge http://dl-cdn.alpinelinux.org/alpine/latest-stable/community >> /etc/apk/repositories && \
  echo @edge http://dl-cdn.alpinelinux.org/alpine/latest-stable/main >> /etc/apk/repositories && \
  apk update && \
  apk add --no-cache \
  chromium

WORKDIR /usr/src/app

COPY . .

COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/node_modules/ ./node_modules
COPY --from=development /usr/src/app/package*.json ./

CMD ["node", "dist/main"]