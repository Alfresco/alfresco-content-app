---
Title: Building from source
---

# Building from source

The Content App is based on [Angular CLI](https://cli.angular.io), and you can use all the commands, generators, and blueprints supported by the CLI.

## Prerequisites for building

- [Node.js](https://nodejs.org/en/) LTS
- (optional) [Angular CLI](https://cli.angular.io/) 7.3.4 or later

> The Angular CLI libraries are already part of the setup.
> You may want installing it as a global (recommended) tool only if you intend using CLI commands separately.

## Cloning and running

Use the following commands to clone the project, install dependencies and run it.

```sh
git clone https://github.com/Alfresco/alfresco-content-app.git
cd alfresco-content-app
npm install
npm start
```

The application runs at port `4200` by default, and should automatically open in the default browser once the project has compiled.

## Setting up environment variables

We need to set some environment variable to be able to run the local dev server. In the project root folder, create an `.env` file (this is gitignored) with the following data:

```bash
# App config settings
APP_CONFIG_ECM_HOST="<url>"
APP_CONFIG_OAUTH2_HOST="<url>"
APP_CONFIG_PROVIDER="BPM"
APP_CONFIG_AUTH_TYPE="BASIC"
APP_CONFIG_OAUTH2_CLIENTID="clientid"
APP_CONFIG_OAUTH2_IMPLICIT_FLOW=true
APP_CONFIG_OAUTH2_SILENT_LOGIN=true
APP_CONFIG_OAUTH2_REDIRECT_SILENT_IFRAME_URI="{protocol}//{hostname}{:port}/assets/silent-refresh.html"
APP_CONFIG_OAUTH2_REDIRECT_LOGIN=/
APP_CONFIG_OAUTH2_REDIRECT_LOGOUT=/

## Proxy settings

The Content App provides a proxy configuration for a local development server that allows you to address specific scenarios with CORS and a native authentication dialog.

You can find settings in the `proxy.conf.js` file in the project's `src` directory. By default, your settings coming from environment variables are preferenced.

**Note:** The proxy settings get automatically applied every time you run the application with the `npm start` script.
You must restart the application every time you change its settings.

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).
