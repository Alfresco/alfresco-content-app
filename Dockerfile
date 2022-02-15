# 1. Generate licenses

FROM node:12-alpine3.14 AS builder
WORKDIR /usr/src/alfresco
COPY package.json package.json

RUN mkdir -p ./licenses && \
  yarn licenses list > ./licenses/licenses.txt && \
  yarn licenses generate-disclaimer > ./licenses/disclaimer.txt

# 2. Generate image

FROM nginxinc/nginx-unprivileged:1.21-alpine

USER root
RUN apk update && apk upgrade
USER 101

ARG PROJECT_NAME
ARG PROVIDER="ECM"
ARG AUTH_TYPE="BASIC"

ENV APP_CONFIG_PROVIDER=$PROVIDER
ENV APP_CONFIG_AUTH_TYPE=$AUTH_TYPE

ENV APP_CONFIG_OAUTH2_HOST="{protocol}//{hostname}{:port}/auth/realms/alfresco"
ENV APP_CONFIG_BPM_HOST="{protocol}//{hostname}{:port}"
ENV APP_CONFIG_ECM_HOST="{protocol}//{hostname}{:port}"

ENV APP_CONFIG_OAUTH2_CLIENTID="alfresco"
ENV APP_CONFIG_OAUTH2_IMPLICIT_FLOW=true
ENV APP_CONFIG_OAUTH2_SILENT_LOGIN=true
ENV APP_CONFIG_OAUTH2_REDIRECT_SILENT_IFRAME_URI="{protocol}//{hostname}{:port}/assets/silent-refresh.html"
ENV APP_CONFIG_OAUTH2_REDIRECT_LOGIN="/"
ENV APP_CONFIG_OAUTH2_REDIRECT_LOGOUT="/"
ENV APP_CONFIG_PLUGIN_AOS=true

COPY docker/default.conf.template /etc/nginx/templates/
COPY docker/docker-entrypoint.d/* /docker-entrypoint.d/

COPY dist/$PROJECT_NAME /usr/share/nginx/html/
COPY dist/$PROJECT_NAME/app.config.json /etc/nginx/templates/app.config.json.template
COPY dist/$PROJECT_NAME/assets/app.extensions.json /etc/nginx/templates/app.extensions.json.template
COPY --from=builder /usr/src/alfresco/licenses /usr/share/nginx/html/

USER root
RUN chmod a+w -R /etc/nginx/conf.d
USER 101

ENV BASE_PATH=/
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx/conf.d
