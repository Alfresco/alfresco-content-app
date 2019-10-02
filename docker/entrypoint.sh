#!/bin/sh

APP_SERVER_PATH=${APP_SERVER_PATH:-/content-app}
cp ./app.config.json /tmp/app.config.json
cp ./index.html /tmp/index.html
cp /nginx.conf /tmp/nginx.conf

if [ -n "${APP_SERVER_PATH}" ];then
  sed -e "s#/content-app#$APP_SERVER_PATH#g" \
    -i /tmp/nginx.conf && \
  cat /tmp/nginx.conf > /nginx.conf
fi

if [ -n "${APP_CONFIG_AUTH_TYPE}" ];then
  sed -e "s/\"authType\": \".*\"/\"authType\": \"${APP_CONFIG_AUTH_TYPE}\"/g" \
    -i /tmp/app.config.json && \
  cat /tmp/app.config.json > ./app.config.json
fi

if [ -n "${APP_CONFIG_OAUTH2_HOST}" ];then
  replace="\/"
  encoded=${APP_CONFIG_OAUTH2_HOST//\//$replace}
  sed -e "s/\"host\": \".*\"/\"host\": \"${encoded}\"/g" \
    -i /tmp/app.config.json && \
  cat /tmp/app.config.json > ./app.config.json
fi

if [ -n "${APP_CONFIG_OAUTH2_CLIENTID}" ];then
  sed -e "s/\"clientId\": \".*\"/\"clientId\": \"${APP_CONFIG_OAUTH2_CLIENTID}\"/g" \
    -i /tmp/app.config.json && \
  cat /tmp/app.config.json > ./app.config.json
fi

if [ -n "${APP_CONFIG_OAUTH2_IMPLICIT_FLOW}" ];then
 sed "/implicitFlow/s/true/${APP_CONFIG_OAUTH2_IMPLICIT_FLOW}/" \
    -i /tmp/app.config.json && \
  cat /tmp/app.config.json > ./app.config.json
fi

if [ -n "${APP_CONFIG_OAUTH2_SILENT_LOGIN}" ];then
 sed "/silentLogin/s/true/${APP_CONFIG_OAUTH2_SILENT_LOGIN}/" \
    -i /tmp/app.config.json && \
  cat /tmp/app.config.json > ./app.config.json
fi

if [ -n "${APP_CONFIG_OAUTH2_REDIRECT_SILENT_IFRAME_URI}" ];then
  replace="\/"
  encoded=${APP_CONFIG_OAUTH2_REDIRECT_SILENT_IFRAME_URI//\//$replace}
  sed -e "s/\"redirectSilentIframeUri\": \".*\"/\"redirectSilentIframeUri\": \"${encoded}\"/g" \
    -i /tmp/app.config.json && \
  cat /tmp/app.config.json > ./app.config.json
fi

if [ -n "${APP_CONFIG_OAUTH2_REDIRECT_LOGIN}" ];then
  replace="\/"
  encoded=${APP_CONFIG_OAUTH2_REDIRECT_LOGIN//\//$replace}
  sed -e "s/\"redirectUri\": \".*\"/\"redirectUri\": \"${encoded}\"/g" \
    -i /tmp/app.config.json && \
  cat /tmp/app.config.json > ./app.config.json
fi

if [ -n "${APP_CONFIG_OAUTH2_REDIRECT_LOGOUT}" ];then
  replace="\/"
  encoded=${APP_CONFIG_OAUTH2_REDIRECT_LOGOUT//\//$replace}
  sed -e "s/\"redirectUriLogout\": \".*\"/\"redirectUriLogout\": \"${encoded}\"/g" \
    -i /tmp/app.config.json && \
  cat /tmp/app.config.json > ./app.config.json
fi

if [[ $ACSURL ]]; then
  replace="\/"
  encoded=${ACSURL//\//$replace}
  sed -i s%{protocol}//{hostname}{:port}%"$encoded"%g /tmp/app.config.json && \
  cat /tmp/app.config.json > ./app.config.json
fi

if [[ $BASE_PATH ]]; then
  replace="\/"
  encoded=${BASE_PATH//\//$replace}
  sed -i s%href=\"/\"%href=\""$encoded"\"%g /tmp/index.html && \
  cat /tmp/index.html > ./index.html
fi

if [ -n "${APP_BASE_SHARE_URL}" ];then
  replace="\/"
  encoded=${APP_BASE_SHARE_URL//\//$replace}
  sed -e "s/\"baseShareUrl\": \".*\"/\"baseShareUrl\": \"${encoded}\"/g" \
    -i /tmp/app.config.json && \
  cat /tmp/app.config.json > ./app.config.json
fi

nginx -g "daemon off;" -c /nginx.conf
