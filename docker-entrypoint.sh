#!/bin/sh

if [[ $ACSURL ]]; then
  sed -i s%{protocol}//{hostname}{:port}%"$ACSURL"%g /usr/share/nginx/html/app.config.json
fi
if [[ $BASEPATH ]]; then
  sed -i s%href=\"/\"%href=\""$BASEPATH"\"%g /usr/share/nginx/html/index.html
fi

nginx -g "daemon off;"
