# Alfresco Content App

## Prerequisites

- Alfresco Content Services (Community) or Alfresco Content Services 5.2.2 (Enterprise)
- [node.js](https://nodejs.org/en/) 8.9.1 or later

## Building and running locally

Please refer to the [developer docs](/build) to get more details on building and running application on your local machine.

## Using with Docker

The Content App provides a "Dockerfile" and "docker-compose" files to aid in running application in a container.
Please refer to the "[Using with Docker](/docker)" article for more details.

## Contribution Policy

### How to contribute

Fork our repository and submit a pull request when your code is ready for review.
To be considered the Travis build has to be green and all our automation tests have to run without regressions.

### Contribute to the existing code base

What are we reviewing for?

- **License**: Every file should contain the Alfresco LICENSE header, LGPL Licence.
- **Tests**: Add unit cases to cover the new behaviour, and make sure all the existing tests are still green.
- **JS Documentation**: Every class needs to have its own inline jsdoc, this documentation should explain the general purpose of the class and of each method.
- **Documentation**: Update the documentation explaining how to use the new functionality, may not be necessary in the cases where change impacts only the CSS style.
- **Clean Coding**: Some good rules are enforced by the tslint, but we want also our code to be easy to read. Please avoid comments inside the code or leaving pieces of code commented out.
- **Localization**: Your contribution needs to support localization, with all new strings externalized, all translations are inside the i18n. The minimum requirement is English.

### How long will it take for my contribution to be reviewed?

The time necessary for a code review will vary, smaller changes may be reviewed within days, while larger changes may take longer.
