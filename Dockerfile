FROM denoland/deno:alpine-1.44.0
RUN apk add --no-cache tzdata

USER 1000:1000
WORKDIR /app
COPY deno.json deno.lock deps.ts ./
RUN deno task cache
COPY assets ./assets
COPY src ./src
COPY main.ts ./

ENV PORT=3000 DATA_DIR=/data BASE_URL=https://logs.moe
EXPOSE 3000
VOLUME /data

CMD ["deno", "task", "start"]
