FROM nginx:stable-alpine
LABEL version="1.3"
LABEL maintainer="Denys Vuika <denys.vuika@alfresco.com>"

COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
COPY dist/app/ .

