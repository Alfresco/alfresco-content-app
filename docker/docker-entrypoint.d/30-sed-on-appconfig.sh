#!/bin/sh

set -e

APP_CONFIG_FILE="${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"

if [ -n "${APP_CONFIG_AUTH_TYPE}" ]; then
  echo "SET APP_CONFIG_AUTH_TYPE"

  sed -e "s/\"authType\": \".*\"/\"authType\": \"${APP_CONFIG_AUTH_TYPE}\"/g" \
    -i "$APP_CONFIG_FILE"
fi

if [ -n "${APP_CONFIG_PROVIDER}" ]; then
  echo "SET APP_CONFIG_PROVIDER"

  sed -e "s/\"providers\": \".*\"/\"providers\": \"${APP_CONFIG_PROVIDER}\"/g" \
    -i "$APP_CONFIG_FILE"
fi

if [ -n "${APP_CONFIG_IDENTITY_HOST}" ]; then
  echo "SET APP_CONFIG_IDENTITY_HOST"

  replace="\/"
  encodedIdentity=${APP_CONFIG_IDENTITY_HOST//\//$replace}
  sed -e "s/\"identityHost\": \".*\"/\"identityHost\": \"$encodedIdentity\"/g" \
    -i "$APP_CONFIG_FILE"
fi

if [ -n "${APP_CONFIG_OAUTH2_HOST}" ]; then
  echo "SET APP_CONFIG_OAUTH2_HOST"

  replace="\/"
  encoded=${APP_CONFIG_OAUTH2_HOST//\//$replace}
  sed -e "s/\"host\": \".*\"/\"host\": \"${encoded}\"/g" \
    -i "$APP_CONFIG_FILE"
fi

if [ -n "${APP_CONFIG_OAUTH2_CLIENTID}" ]; then
  echo "SET APP_CONFIG_OAUTH2_CLIENTID"

  sed -e "s/\"clientId\": \".*\"/\"clientId\": \"${APP_CONFIG_OAUTH2_CLIENTID}\"/g" \
    -i "$APP_CONFIG_FILE"
fi

if [ -n "${APP_CONFIG_OAUTH2_IMPLICIT_FLOW}" ]; then
  echo "SET APP_CONFIG_OAUTH2_IMPLICIT_FLOW"

  sed -e "s/\"implicitFlow\": [^,]*/\"implicitFlow\": ${APP_CONFIG_OAUTH2_IMPLICIT_FLOW}/g" \
    -i "$APP_CONFIG_FILE"
fi

if [ -n "${APP_CONFIG_OAUTH2_SILENT_LOGIN}" ]; then
  echo "SET APP_CONFIG_OAUTH2_SILENT_LOGIN"

  sed -e "s/\"silentLogin\": [^,]*/\"silentLogin\": ${APP_CONFIG_OAUTH2_SILENT_LOGIN}/g" \
    -i "$APP_CONFIG_FILE"
fi

if [ -n "${APP_CONFIG_OAUTH2_REDIRECT_SILENT_IFRAME_URI}" ]; then
  echo "SET APP_CONFIG_OAUTH2_REDIRECT_SILENT_IFRAME_URI"

  replace="\/"
  encoded=${APP_CONFIG_OAUTH2_REDIRECT_SILENT_IFRAME_URI//\//$replace}
  sed -e "s/\"redirectSilentIframeUri\": \".*\"/\"redirectSilentIframeUri\": \"${encoded}\"/g" \
    -i "$APP_CONFIG_FILE"
fi

if [ -n "${APP_CONFIG_OAUTH2_REDIRECT_LOGIN}" ]; then
  echo "SET APP_CONFIG_OAUTH2_REDIRECT_LOGIN"

  replace="\/"
  encoded=${APP_CONFIG_OAUTH2_REDIRECT_LOGIN//\//$replace}
  sed -e "s/\"redirectUri\": \".*\"/\"redirectUri\": \"${encoded}\"/g" \
    -i "$APP_CONFIG_FILE"
fi

if [ -n "${APP_CONFIG_OAUTH2_REDIRECT_LOGOUT}" ]; then
  echo "SET APP_CONFIG_OAUTH2_REDIRECT_LOGOUT"

  replace="\/"
  encoded=${APP_CONFIG_OAUTH2_REDIRECT_LOGOUT//\//$replace}
  sed -e "s/\"redirectUriLogout\": \".*\"/\"redirectUriLogout\": \"${encoded}\"/g" \
    -i "$APP_CONFIG_FILE"
fi

if [[ -n "${APP_CONFIG_BPM_HOST}" ]]; then
  echo "SET APP_CONFIG_BPM_HOST"

  replace="\/"
  encoded=${APP_CONFIG_BPM_HOST//\//$replace}
  sed -e "s/\"bpmHost\": \".*\"/\"bpmHost\": \"${encoded}\"/g" \
    -i "$APP_CONFIG_FILE"
fi

if [[ -n "${APP_CONFIG_ECM_HOST}" ]]; then
  echo "SET APP_CONFIG_ECM_HOST"

  replace="\/"
  encoded=${APP_CONFIG_ECM_HOST//\//$replace}
  sed -e "s/\"ecmHost\": \".*\"/\"ecmHost\": \"${encoded}\"/g" \
    -i "$APP_CONFIG_FILE"
fi

if [ -n "${APP_BASE_SHARE_URL}" ]; then
  echo "SET APP_BASE_SHARE_URL"

  replace="\/"
  encoded=${APP_BASE_SHARE_URL//\//$replace}
  sed -e "s/\"baseShareUrl\": \".*\"/\"baseShareUrl\": \"${encoded}\"/g" \
    -i "$APP_CONFIG_FILE"
fi
