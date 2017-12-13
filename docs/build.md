# Building from source code

The Content App is based on [Angular CLI](https://cli.angular.io), and you can use all the commands, generators and blueprints supported by the CLI.

## Prerequisites

- [Node.js](https://nodejs.org/en/) 8.9.1 or later LTS version
- [Angular CLI](https://cli.angular.io/)

## Cloning and running

Use the following commands to clone the project, install dependencies and run it.

```sh
git clone https://github.com/Alfresco/alfresco-content-app.git
cd alfresco-content-app
npm install
npm start
```

The application runs at port 3000 by default, and should automatically open in the default browser once project compilation finishes.

## Proxy settings

The Content App provides a proxy configuration for local development server
that allows you to address specific scenarios with CORS and native authentication dialog.

You can find settings in the "proxy.conf.js" file in the project root directory.

<p class="warning">
The proxy settings get automatically applied every time you run the application with "npm start" script.
You must restart the application every time you change the settings values.
</p>

## Running documentation locally

For development purposes, you can run and test documentation locally.
This is useful when working in different branches instead of a `master` one.

Run the following command to install the lightweight development server [wsrv](https://denysvuika.gitlab.io/wsrv/#/):

```sh
npm install -g wsrv
```

Now you can use the next command to serve the documentation folder in the browser:

```sh
wsrv docs/ -s -l -o
```

The browser page is going to automatically reload upon changes.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
