# Alfresco Content Application

Please refer to the public [documentation](https://alfresco-content-app.netlify.app/) for more details

## Requirements

| Name    | Version |
|---------|---------|
| Node.js | 18.x    |
| Npm     | 9.x     |

## Compatibility

| ACA   | ADF           | ACS        | Node | Angular |
|-------|---------------|------------|------|---------|
| 7.2.x | 8.2.1         | 23.x, 25.x | 22.x | 19.x    |
| 7.1.x | 8.1.1         | 25.2       | 22.x | 19.x    |
| 7.0.x | 8.0.0         | 25.2       | 22.x | 19.x    |
| 6.0.x | 7.0.0         | 25.1       | 20.x | 17.x    |
| 5.3.x | 7.0.0-alpha.7 | 23.4       | 18.x | 16.x    |
| 5.2.x | 7.0.0-alpha.6 | 23.4       | 18.x | 16.x    |
| 5.1.x | 7.0.0-alpha.3 | 23.3       | 18.x | 15.x    |
| 5.0.x | 7.0.0-alpha.2 | 23.3       | 18.x | 15.x    |
| 4.4.x | 6.7           | 23.2       | 18.x | 14.x    |
| 4.3.x | 6.4           | 23.1       | 18.x | 14.x    |
| 4.2.x | 6.3           | 23.1.0-M4  | 18.x | 14.x    |
| 4.1.x | 6.2           | 7.4        | 18.x | 14.x    |
| 4.0.x | 6.1           | 7.4        | 14.x | 14.x    |
| 3.1.x | 5.1           | 7.3        |      |         |
| 3.0.x | 5.0           | 7.3        |      |         |

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

