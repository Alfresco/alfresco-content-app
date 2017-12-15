# Alfresco Example Content Application

<p align="center">
    <img title="Alfresco" width="250px" src="alfresco.png" alt="Alfresco">
</p>

## Introduction

The Alfresco Content Application is an example application built using
[Alfresco Application Development Framework (ADF)](https://github.com/Alfresco/alfresco-ng2-components) components and was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.7.

### Who is this example application for

This example application demonstrates to Angular software engineers
how to construct a content application using the Alfresco ADF.

This example application represents a meaningful composition of ADF components that provide end users
with a simple and easy to use interface for working with files stored in the Alfresco Content Services repository.

[Public documentation](https://alfresco.github.io/alfresco-content-app/)

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:3000/` (opens by default).
The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Running documentation locally

For development purposes, you can run and test documentation locally.
That is useful when working in different branches instead of a `master` one.

Run the following command to install the lightweight development server [wsrv](https://denysvuika.gitlab.io/wsrv/#/):

```sh
npm install -g wsrv
```

Now you can use the next command to serve the documentation folder in the browser:

```sh
wsrv docs/ -s -l -o
```

The browser page is going to automatically reload upon changes.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
