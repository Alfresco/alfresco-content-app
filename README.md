<p align="left"> <img title="Alfresco" src="alfresco.png" alt="Alfresco - Simply a better way to create amazing digital experiences"></p>

# Alfresco Content Application

Please refer to the [Public documentation](https://alfresco-content-app.netlify.com/) for more details

| branch  | status                                                                                                                                         |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| master  | [![Build Status](https://travis-ci.com/Alfresco/alfresco-content-app.svg?branch=master)](https://travis-ci.com/Alfresco/alfresco-content-app)  |
| develop | [![Build Status](https://travis-ci.org/Alfresco/alfresco-content-app.svg?branch=develop)](https://travis-ci.com/Alfresco/alfresco-content-app) |

## Setting up environment variables

We need to set some environment variable to be able to run the local dev server. In the project root folder, create an `.env` file (this is gitignored) with the following data:

```bash
# App config settings
APP_CONFIG_BPM_HOST="<url>"
APP_CONFIG_ECM_HOST="<url>"
APP_CONFIG_OAUTH2_HOST="<url>"
APP_CONFIG_IDENTITY_HOST="<url>"
APP_CONFIG_PROVIDER="ALL"
APP_CONFIG_AUTH_TYPE="OAUTH"
APP_CONFIG_OAUTH2_CLIENTID="alfresco"
APP_CONFIG_OAUTH2_IMPLICIT_FLOW=true
APP_CONFIG_OAUTH2_SILENT_LOGIN=true
APP_CONFIG_OAUTH2_REDIRECT_SILENT_IFRAME_URI="{protocol}//{hostname}{:port}/assets/silent-refresh.html"
APP_CONFIG_OAUTH2_REDIRECT_LOGIN=/
APP_CONFIG_OAUTH2_REDIRECT_LOGOUT=/
# CONTENT - ALFRESCO OFFICE SERVICES PLUGIN RELATED
APP_CONFIG_PLUGIN_AOS=true
