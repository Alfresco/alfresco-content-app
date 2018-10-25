---
---

# Building from source

The Content App is based on [Angular CLI](https://cli.angular.io), and you can use all the commands, generators, and blueprints supported by the CLI.

## Prerequisites for building

- [Node.js](https://nodejs.org/en/) LTS
- [Angular CLI](https://cli.angular.io/) 1.7.3

## Cloning and running

Use the following commands to clone the project, install dependencies and run it.

```sh
git clone https://github.com/Alfresco/alfresco-content-app.git
cd alfresco-content-app
npm install
npm start
```

The application runs at port `4200` by default, and should automatically open in the default browser once the project has compiled.

## Proxy settings

The Content App provides a proxy configuration for a local development server that allows you to address specific scenarios with CORS and a native authentication dialog.

You can find settings in the "proxy.conf.js" file in the project root directory.

<p class="warning">
The proxy settings get automatically applied every time you run the application with the "npm start" script.
You must restart the application every time you change its settings.
</p>

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).