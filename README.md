# Alfresco Content Application

Please refer to the public [documentation](https://alfresco-content-app.netlify.com/) for more details

## Requirements

| Name | Version |
| --- | --- |
| Node.js | 18.x |
| Npm | 9.x |

## Compatibility

| ACA  | ADF | ACS | Node | Angular |
| ---- | --- | --- | ---- | ------- |
| 4.1  | 6.2 | 7.4 | 18.x | 14.x    |
| 4.0  | 6.1 | 7.4 | 14.x | 14.x    |
| 3.1  | 5.1 | 7.3 |      |         |
| 3.0  | 5.0 | 7.3 |      |         |

> See <https://angular.io/guide/versions> for more details on Angular and Node.js compatibility

## Running

Create an `.env` file in the project root folder with the following content

```yml
APP_CONFIG_ECM_HOST="<URL>"
APP_CONFIG_OAUTH2_HOST=http://localhost:4200/auth/realms/alfresco
```

Where `<URL>` is the address of the ACS.

Run the following commands:

```sh
npm install
npm start
```

### Using Local ADF

Clone the `alfresco-ng2-components` and `alfresco-content-app` repositories in the same folder, and run the following command:

```sh
npm start -- --configuration=adf
```

Changing the ADF code results in the recompilation and hot-reloading of the ACA application.

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

## Triggering the build to use specific branch of ADF with CI flags

You can create commits with the intention of running the build pipeline using a specific branch of ADF. To achieve this, you need to add a specific CI flag in your commit message:

```text
[link-adf:my-custom-branch-in-adf-repo]
```

So for example a commit message can be like:

```text
[link-adf:my-custom-branch-in-adf-repo] Adding XYZ features for the navigation header
```

When having this CI flag present in the commit message, the CI attempts to check out the given branch of ADF and use it when building / testing the applications.

### Important things to consider

- **This flag can only be used for PRs, not for any other type of builds**
- At the end of a PR build, there is a check which will make the build fail if you used this CI flag. This is there to make sure, only those PRs can be merged, which are using already merged in ADF features, **since this flag's only purpose is to be able to test whether the applications could be built with an experimental ADF feature or not**.

    This step is rendered in the `Finalize` stage

    ![travis stage](./assets/link-adf-travis-stage.png)

    with an error message

    ![travis stage](./assets/link-adf-travis-console.png)
