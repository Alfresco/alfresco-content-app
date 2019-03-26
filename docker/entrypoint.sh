#!/bin/sh

cp ./app.config.json /tmp/app.config.json
cp ./index.html /tmp/index.html

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
  sed -i s%{protocol}//{hostname}{:port}%"$ACSURL"%g /tmp/app.config.json && \
  cat /tmp/app.config.json > ./app.config.json
fi

if [[ $BASEPATH ]]; then
  sed -i s%href=\"/\"%href=\""$BASEPATH"\"%g /tmp/index.html && \
  cat /tmp/index.html > ./index.html
fi

if [ -n "${APP_BASE_SHARE_URL}" ];then
  sed -e "s/\"baseShareUrl\": \".*\"/\"baseShareUrl\": \"${APP_BASE_SHARE_URL}\"/g" \
    -i /tmp/app.config.json && \
  cat /tmp/app.config.json > ./app.config.json
fi

nginx -g "daemon off;"
