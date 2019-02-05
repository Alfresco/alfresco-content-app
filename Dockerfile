# 1. Generate licenses

FROM node:11.9-alpine AS builder
WORKDIR /usr/src/alfresco
COPY package.json package.json

RUN mkdir -p ./licenses && \
  yarn licenses list > ./licenses/licenses.txt && \
  yarn licenses generate-disclaimer > ./licenses/disclaimer.txt

# 2. Generate image

FROM nginx:stable-alpine
LABEL version="1.7"
LABEL maintainer="Denys Vuika <denys.vuika@alfresco.com>"

COPY nginx.conf /etc/nginx/nginx.conf

COPY ./docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

WORKDIR /usr/share/nginx/html
COPY dist/app/ .
COPY --from=builder /usr/src/alfresco/licenses ./licenses

ENTRYPOINT [ "/docker-entrypoint.sh" ]
