# Docker Support

Running local build with Docker

```shell
npm run build
```

The application is already preconfigured to run alongside backend containers within the Docker Compose.

If you need to provide custom settings, update `dist/content-ce/app.config.json` file.
See [Configuration](/configuration/) section for more details

Build and run the container:

```shell
./docker/run.sh
```

The application is configured to run at `http://localhost:8081`.

## Containerized Deployment

Typically, you do not need changing application configuration when running ACA in the containerized deployment scenario.
All defaults are already preconfigured and pointing to the locally running Nginx proxy.

Please refer to [ACS Deployment](https://github.com/Alfresco/acs-deployment)
and [ACS Docker Compose](https://github.com/Alfresco/acs-deployment/tree/master/docs/docker-compose) for more details.

## Building manually

Update `dist/content-ce/app.config.json` if needed.

```shell
# cleanup previous
docker rmi -f alfresco/alfresco-content-app

# build
docker build -t alfresco/alfresco-content-app .
```

You can now run this locally:

```shell
docker run --rm -it --user 1000:1000 --publish 8081:8080 alfresco/alfresco-content-app
```

Navigate to `http://localhost:8081`.

## Docker Variables

There is a number of environment variables that you can define to override the default configuration:

**Example**

```shell
docker run --rm -it \
  --env APP_CONFIG_AUTH_TYPE="OAUTH" \
  --env APP_CONFIG_ECM_HOST="https://some.host.com" \
  --user 1000:1000 \
  --publish 8081:8080 alfresco/alfresco-content-app
```

### Configuration Mapping

| Name                                         | Config Path                      |
|----------------------------------------------|----------------------------------|
| APP_CONFIG_AUTH_TYPE                         | `authType`                       |
| APP_CONFIG_PROVIDER                          | `providers`                      |
| APP_CONFIG_IDENTITY_HOST                     | `identityHost`                   |
| APP_CONFIG_BPM_HOST                          | `bpmHost`                        |
| APP_CONFIG_ECM_HOST                          | `ecmHost`                        |
| APP_BASE_SHARE_URL                           | `baseShareUrl`                   |
| APP_CONFIG_OAUTH2_HOST                       | `oauth2.host`                    |
| APP_CONFIG_OAUTH2_CLIENTID                   | `oauth2.clientId`                |
| APP_CONFIG_OAUTH2_CLIENT_SECRET              | `oauth2.secret`                  |
| APP_CONFIG_OAUTH2_IMPLICIT_FLOW              | `oauth2.implicitFlow`            |
| APP_CONFIG_OAUTH2_CODE_FLOW                  | `oauth2.codeFlow`                |
| APP_CONFIG_OAUTH2_SILENT_LOGIN               | `oauth2.silentLogin`             |
| APP_CONFIG_OAUTH2_LOGOUT_URL                 | `oauth2.logoutUrl`               |
| APP_CONFIG_OAUTH2_LOGOUT_PARAMETERS          | `oauth2.logoutParameters`        |
| APP_CONFIG_OAUTH2_AUDIENCE                   | `oauth2.audience`                |
| APP_CONFIG_OAUTH2_REDIRECT_SILENT_IFRAME_URI | `oauth2.redirectSilentIframeUri` |
| APP_CONFIG_OAUTH2_REDIRECT_LOGIN             | `oauth2.redirectUri`             |
| APP_CONFIG_OAUTH2_REDIRECT_LOGOUT            | `oauth2.redirectUriLogout`       |
