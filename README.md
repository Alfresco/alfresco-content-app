# Alfresco Content Application

Please refer to the public [documentation](https://alfresco-content-app.netlify.com/) for more details

## Requirements

| Name    | Version |
|---------|---------|
| Node.js | 18.x    |
| Npm     | 9.x     |

## Compatibility

| ACA | ADF | ACS       | Node | Angular |
|-----|-----|-----------|------|---------|
| 4.3 | 6.4 | 23.1      | 18.x | 14.x    |
| 4.2 | 6.3 | 23.1.0-M4 | 18.x | 14.x    |
| 4.1 | 6.2 | 7.4       | 18.x | 14.x    |
| 4.0 | 6.1 | 7.4       | 14.x | 14.x    |
| 3.1 | 5.1 | 7.3       |      |         |
| 3.0 | 5.0 | 7.3       |      |         |

> See <https://angular.io/guide/versions> for more details on Angular and Node.js compatibility

## Running

Create an `.env` file in the project root folder with the following content

```yml
BASE_URL="<URL>"
```

Where `<URL>` is the address of the ACS.

Run the following commands:

```sh
npm install
npm start
```

## Unit Tests

Use following command to test the projects:

```sh
nx test <project>
```

### Code Coverage

The projects are already configured to produce code coverage reports in console and HTML output.

You can view HTML reports in the `./coverage/<project>` folder.

When working with unit testing and code coverage improvement, you can run unit tests in the "live reload" mode:

```sh
nx test <project> -- --watch
```

Upon changing unit tests code, you can track the coverage results either in the console output, or by reloading the HTML report in the browser.

