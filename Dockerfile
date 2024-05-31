FROM denoland/deno:alpine-1.44.0

RUN apk add --no-cache tzdata

USER 1000:1000
WORKDIR /app
COPY assets ./assets
COPY src ./src
COPY deno.json deno.lock main.ts ./
RUN deno cache main.ts --lock

ENV PORT=3000 DATA_DIR=/data BASE_URL=https://logs.moe
EXPOSE 3000
VOLUME /data

CMD ["deno", "task", "start"]
