#!/bin/sh

set -e

echo Running sed on "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"

if [ -n "${APP_CONFIG_AUTH_TYPE}" ]; then
  sed -e "s/\"authType\": \".*\"/\"authType\": \"${APP_CONFIG_AUTH_TYPE}\"/g" \
    -i "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"
fi

if [ -n "${APP_CONFIG_IDENTITY_HOST}" ]; then
  replace="\/"
  encodedIdentity=${APP_CONFIG_IDENTITY_HOST//\//$replace}
  sed -e "s/\"identityHost\": \".*\"/\"identityHost\": \"$encodedIdentity\"/g" \
    -i "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"
fi

if [ -n "${APP_CONFIG_OAUTH2_HOST}" ]; then
  replace="\/"
  encoded=${APP_CONFIG_OAUTH2_HOST//\//$replace}
  sed -e "s/\"host\": \".*\"/\"host\": \"${encoded}\"/g" \
    -i "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"
fi

if [ -n "${APP_CONFIG_OAUTH2_CLIENTID}" ]; then
  sed -e "s/\"clientId\": \".*\"/\"clientId\": \"${APP_CONFIG_OAUTH2_CLIENTID}\"/g" \
    -i "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"
fi

if [ -n "${APP_CONFIG_OAUTH2_IMPLICIT_FLOW}" ]; then
  sed -e "s/\"implicitFlow\": [^,]*/\"implicitFlow\": ${APP_CONFIG_OAUTH2_IMPLICIT_FLOW}/g" \
    -i "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"
fi

if [ -n "${APP_CONFIG_OAUTH2_SILENT_LOGIN}" ]; then
  sed -e "s/\"silentLogin\": [^,]*/\"silentLogin\": ${APP_CONFIG_OAUTH2_SILENT_LOGIN}/g" \
    -i "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"
fi

if [ -n "${APP_CONFIG_OAUTH2_REDIRECT_SILENT_IFRAME_URI}" ]; then
  replace="\/"
  encoded=${APP_CONFIG_OAUTH2_REDIRECT_SILENT_IFRAME_URI//\//$replace}
  sed -e "s/\"redirectSilentIframeUri\": \".*\"/\"redirectSilentIframeUri\": \"${encoded}\"/g" \
    -i "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"
fi

if [ -n "${APP_CONFIG_OAUTH2_REDIRECT_LOGIN}" ]; then
  replace="\/"
  encoded=${APP_CONFIG_OAUTH2_REDIRECT_LOGIN//\//$replace}
  sed -e "s/\"redirectUri\": \".*\"/\"redirectUri\": \"${encoded}\"/g" \
    -i "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"
fi

if [ -n "${APP_CONFIG_OAUTH2_REDIRECT_LOGOUT}" ]; then
  replace="\/"
  encoded=${APP_CONFIG_OAUTH2_REDIRECT_LOGOUT//\//$replace}
  sed -e "s/\"redirectUriLogout\": \".*\"/\"redirectUriLogout\": \"${encoded}\"/g" \
    -i "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"
fi

if [[ -n "${APP_CONFIG_BPM_HOST}" ]]; then
  replace="\/"
  encoded=${APP_CONFIG_BPM_HOST//\//$replace}
  sed -e "s/\"bpmHost\": \".*\"/\"bpmHost\": \"${encoded}\"/g" \
    -i "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"
fi

if [[ -n "${APP_CONFIG_ECM_HOST}" ]]; then
  replace="\/"
  encoded=${APP_CONFIG_ECM_HOST//\//$replace}
  sed -e "s/\"ecmHost\": \".*\"/\"ecmHost\": \"${encoded}\"/g" \
    -i "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"
else
  sed -e "s/\"ecmHost\": \".*\"/\"ecmHost\": \"\"/g" \
    -i "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"
fi

if [ -n "${APP_ALLOW_CUSTOM_RESOURCES}" ]; then
  sed -e "s/\"allowCustomResources\": [^,]*/\"allowCustomResources\": ${APP_ALLOW_CUSTOM_RESOURCES}/g" \
    -i "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"
fi

if [ -n "${APP_CONFIG_APPS_DEPLOYED}" ]; then
  sed -e "s/\"alfresco-deployed-apps\": \[.*\]/\"alfresco-deployed-apps\": ${APP_CONFIG_APPS_DEPLOYED}/g" \
    -i "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"
fi

if [ -n "${ENABLE_CUSTOM_CONNECTORS}" ]; then
   sed -e "s/\"enableCustomConnectors\": [^,]*/\"enableCustomConnectors\": ${ENABLE_CUSTOM_CONNECTORS}/g" \
    -i "${NGINX_ENVSUBST_OUTPUT_DIR}/app.config.json"
fi

# application specific ce replacements

if [ -n "${APP_BASE_SHARE_URL}" ];then
  replace="\/"
  encoded=${APP_BASE_SHARE_URL//\//$replace}
  sed -e "s/\"baseShareUrl\": \".*\"/\"baseShareUrl\": \"${encoded}\"/g" \
    -i /tmp/app.config.json && \
  cat /tmp/app.config.json > ./app.config.json
fi
