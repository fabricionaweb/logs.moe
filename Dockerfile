FROM denoland/deno:alpine-1.45.5 AS base
ENV DENO_ENV=production
WORKDIR /app
COPY deno.json ./

FROM base AS builder
RUN apk add --no-cache esbuild
COPY assets ./assets
RUN deno task build-assets

FROM base AS runner
RUN apk add --no-cache tzdata
COPY deno.lock deps.ts ./
RUN deno task cache-deps
COPY --from=builder /app/assets ./assets
COPY src ./src
COPY main.ts ./

USER deno
ENV PORT=3000 DATA_DIR=/data BASE_URL=https://logs.moe
EXPOSE 3000
VOLUME /data

CMD ["deno", "task", "start"]
