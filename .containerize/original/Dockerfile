# syntax=docker/dockerfile:1

FROM docker.io/oven/bun:1-alpine AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM ghcr.io/static-web-server/static-web-server:2 AS sws

FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=sws /static-web-server /usr/local/bin/static-web-server
COPY --from=build /app/dist /srv
ENV SERVER_PORT=8080 \
    SERVER_ROOT=/srv \
    SERVER_FALLBACK_PAGE=/srv/index.html \
    SERVER_SECURITY_HEADERS=true \
    SERVER_DISABLE_SYMLINKS=true \
    SERVER_IGNORE_HIDDEN_FILES=true \
    SERVER_HEALTH=true
EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/static-web-server"]
