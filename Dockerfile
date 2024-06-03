# deno kv doesnt on alpine/musl
FROM node:20.10-slim as base
ENV NODE_ENV=production NPM_CONFIG_UPDATE_NOTIFIER=false
WORKDIR /app

FROM base as builder
COPY package*.json ./
RUN npm ci --include=dev
COPY assets ./assets
RUN npm run build-assets

FROM base as runner
ENV npm_config_build_from_source=true
ARG DEBIAN_FRONTEND=noninteractive
RUN apt update && \
    apt install -y tzdata && \
    apt clean
COPY package*.json ./
RUN npm ci
COPY --from=builder /app/assets ./assets
COPY src ./src
COPY main.js ./

USER node
ENV PORT=3000 DATA_DIR=/data BASE_URL=https://logs.moe
EXPOSE 3000
VOLUME /data

CMD ["npm", "start"]
