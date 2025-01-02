FROM public.ecr.aws/docker/library/node:23.5.0-alpine AS base
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./

FROM base AS builder
RUN apk add --no-cache esbuild
COPY static ./static
RUN npm run build-static

FROM base AS runner
RUN apk add --no-cache tzdata tini
COPY --from=builder /app/static/dist ./static
COPY src ./src
COPY server.js ./
RUN npm ci

USER node
ENV PORT=3000 BIND=0.0.0.0
ENV DB_PATH=/data/gists.db
ENV BASE_URL=https://logs.moe

EXPOSE 3000
WORKDIR /data
VOLUME /data

CMD ["/app/server.js"]
ENTRYPOINT ["/sbin/tini", "--"]
