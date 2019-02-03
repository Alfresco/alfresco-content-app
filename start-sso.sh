export HOST_IP=$(ifconfig | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1)
export AUTH_SERVER_URL="http://${HOST_IP}:8085/auth"
export APP_URL="http://${HOST_IP}:4000"

export APP_CONFIG_AUTH_TYPE="OAUTH"
export APP_CONFIG_OAUTH2_HOST="${AUTH_SERVER_URL}/realms/alfresco"
export APP_CONFIG_OAUTH2_CLIENTID="alfresco"
export APP_CONFIG_OAUTH2_REDIRECT_SILENT_IFRAME_URI="${APP_URL}/assets/silent-refresh.html"
export APP_CONFIG_OAUTH2_REDIRECT_LOGIN="/"
export APP_CONFIG_OAUTH2_REDIRECT_LOGOUT="/logout"

docker-compose -f docker-compose-keycloak.yml up -d --build

echo "Waiting for the app..."
npm run wait:app

echo "Identity Service: ${AUTH_SERVER_URL}"
echo "Realm: ${APP_CONFIG_OAUTH2_HOST}"
echo "Content Workspace: ${APP_URL}"
