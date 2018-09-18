#!/bin/sh

if [[ $ACSURL ]]; then
  sed -i s%{protocol}//{hostname}{:port}%"$ACSURL"%g /usr/share/nginx/html/app.config.json
fi

nginx -g "daemon off;"
