# Alfresco Example Content Application

<p align="center">
    <img title="Alfresco" width="250px" src="alfresco.png" alt="Alfresco">
</p>

## Introduction

The Alfresco Content Application is an example application built using
[Alfresco Application Development Framework (ADF)](https://github.com/Alfresco/alfresco-ng2-components) components and was generated with [Angular CLI](https://github.com/angular/angular-cli).

### Who is this example application for

This example application demonstrates to Angular software engineers
how to construct a content application using the Alfresco ADF.

This example application represents a meaningful composition of ADF components that provide end users
with a simple and easy to use interface for working with files stored in the Alfresco Content Services repository.

[Public documentation](https://alfresco.github.io/alfresco-content-app/)

### Raising issues and feature requests

Log any issues in the ['ACA' JIRA project](https://issues.alfresco.com/jira/projects/ACA),
please include a clear description, steps to reproduce and screenshots where appropriate.

All issues will be reviewed; bugs will be categorized if reproducible and enhancement/feature suggestions
will be considered against existing priorities if the use case serves a general-purpose need.

## Want to help?

Want to file a bug, contribute some code, or improve documentation? Excellent!
Read up on our guidelines for [contributing][contributing]
and then check out one of our issues in the [Jira][jira] or [GitHub][github]

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/` (opens by default).
The app will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project in the production mode. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run the local instance of the application packaged into the docker image together with the ACS images:

```sh
npm run build
npm run start:docker
```

The ACA runs on port 4000 inside the docker container.
Run `npm run e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

```sh
npm run e2e
```

When testing is over you can stop all corresponding containers:

```sh
npm run stop:docker
```

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

[contributing]: https://github.com/Alfresco/alfresco-content-app/blob/master/CONTRIBUTING.md
[github]: https://github.com/Alfresco/alfresco-content-app/issues
[jira]: https://issues.alfresco.com/jira/projects/ACA
