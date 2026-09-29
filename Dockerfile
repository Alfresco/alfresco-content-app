# 1. Generate licenses

FROM --platform=$BUILDPLATFORM node:22.14.0-alpine AS builder
WORKDIR /usr/src/alfresco

RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod

RUN mkdir -p ./licenses && \
  pnpm licenses list --prod > ./licenses/licenses.txt && \
  npx @quantco/pnpm-licenses generate-disclaimer --prod > ./licenses/disclaimer.txt

# 2. Generate image

FROM nginxinc/nginx-unprivileged:1-alpine

USER root
RUN apk update && apk upgrade
USER 101

COPY docker/default.conf.template /etc/nginx/templates/
COPY docker/docker-entrypoint.d/* /docker-entrypoint.d/

COPY dist/content-ce /usr/share/nginx/html/
COPY dist/content-ce/app.config.json /etc/nginx/templates/app.config.json.template
COPY dist/content-ce/assets/app.extensions.json /etc/nginx/templates/app.extensions.json.template
COPY --from=builder /usr/src/alfresco/licenses /usr/share/nginx/html/

USER root
RUN chmod a+w -R /etc/nginx/conf.d
USER 101

ENV BASE_PATH=/
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx/conf.d
