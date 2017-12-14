# Alfresco Example Content Application

## Introduction

The Alfresco Content Application is an example application built using
[Alfresco Application Development Framework (ADF)](https://github.com/Alfresco/alfresco-ng2-components) components.

### Who is this example application for

This example application demonstrates to Angular software engineers
how to construct a content application using the Alfresco ADF.

This example application represents a meaningful composition of ADF components that provide end users
with a simple and easy to use interface for working with files stored in the Alfresco Content Services repository.

### Prerequisites

This application uses the latest releases from Alfresco:

- [Alfresco ADF version 2.0](https://community.alfresco.com/community/application-development-framework/pages/get-started)
- [Alfresco Content Services version 5.2.2](https://www.alfresco.com/platform/content-services-ecm)
- [Alfresco Community Edition 201707](https://www.alfresco.com/products/community/download)

<p class="warning">
You also need <a href="https://nodejs.org/en/" target="_blank">node.js</a> (8.9.1 or later) installed to build it locally from source code.
</p>

The latest version of the Alfresco Content platform is required
due to the application using the latest [REST APIs](https://docs.alfresco.com/5.2/pra/1/topics/pra-welcome.html) developments.

## Where to get help

There are several ways to get help with building applications using the Alfresco Application Development Framework:

### Alfresco DevCon 2018

DevCon 2018 is an international developer conference entirely dedicated to Alfresco technology.
With the support of our community, customers, and partners, DevCon will increase your technical know-how,
connect you with other Alfresco developers, and let you collaborate with our team and each other.

Register now to avoid disappointment, places are limited:
http://devcon.alfresco.com/

### Alfresco Community

Visit the Alfresco Community space where you can find many resources to help you get started building your application,
along with blog posts from the Alfresco developers and much more:
https://community.alfresco.com/community/application-development-framework

### Alfresco ADF Gitter

Join the vibrant community in Gitter where you can chat with experienced developers,
including the Alfresco employees working directly on the ADF and this example application project:
https://gitter.im/Alfresco/alfresco-ng2-components

### Alfresco Developer Support

Developer Support is a subscription-based support offering delivered remotely
by a dedicated team of development-focused, senior Support Engineers.
This support offering is best for customers and partners that require on-going support
for their development teams and customized code.

Visit the Developer Support Services section on the Alfresco website for more information:
https://www.alfresco.com/alfresco-developer-support-services

### Alfresco University

Training with Alfresco University is the best way to acquire the right skills for your team to deliver a successful Alfresco implementation.
The most cost-effective way to take advantage of this valuable training is through Alfresco University Passport.

Visit the Alfresco University section on the Alfresco website for more information:
https://www.alfresco.com/alfresco-university

## Building and running locally

Please refer to the [developer docs](/build) to get more details on building and running application on your local machine.

## Using with Docker

The Content App provides a "Dockerfile" and "docker-compose" files to aid in running application in a container.
Please refer to the "[Using with Docker](/docker)" article for more details.

## Contribution Policy

### How to contribute

Fork our repository and submit a pull request when your code is ready for review.
To be considered the Travis build must be green and all our automation tests must run without regressions.

### Contribute to the existing code base

What are we reviewing for?

- **License**: Every file should contain the Alfresco LICENSE header, LGPL Licence.
- **Tests**: Add unit cases to cover the new behavior, and make sure all the existing tests are still green.
- **JS Documentation**: Every class needs to have its own inline jsdoc, this documentation should explain the general purpose of the class and of each method.
- **Documentation**: Update the documentation explaining how to use the new functionality, may not be necessary in the cases where change impacts only the CSS style.
- **Clean Coding**: Some good rules are enforced by the tslint, but we want also our code to be easy to read. Please avoid comments inside the code or leaving pieces of code commented out.
- **Localization**: Your contribution needs to support localization, with all new strings externalized, all translations are inside the i18n. The minimum requirement is English.

### How long will it take for my contribution to be reviewed

The time necessary for a code review will vary, smaller changes may be reviewed within days, while larger changes may take longer.
