FROM nginx:stable-alpine
LABEL version="1.4"
LABEL maintainer="Denys Vuika <denys.vuika@alfresco.com>"

COPY nginx.conf /etc/nginx/nginx.conf

COPY ./docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

WORKDIR /usr/share/nginx/html
COPY dist/app/ .

ENTRYPOINT [ "/docker-entrypoint.sh" ]
