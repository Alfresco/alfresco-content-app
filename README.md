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
APP_CONFIG_PLUGIN_AOS=false
APP_CONFIG_PLUGIN_CONTENT_SERVICE=true
APP_CONFIG_PLUGIN_FOLDER_RULES=true
APP_CONFIG_ENABLE_MOBILE_APP_SWITCH=false
APP_CONFIG_PROVIDER=ECM
APP_CONFIG_AUTH_TYPE=BASIC
APP_CONFIG_OAUTH2_HOST=http://localhost:4200/auth/realms/alfresco
APP_CONFIG_OAUTH2_CLIENTID=alfresco
APP_CONFIG_PLUGIN_AOS=true
APP_CONFIG_PLUGIN_CONTENT_SERVICE=true
APP_CONFIG_PLUGIN_FOLDER_RULES=true
APP_CONFIG_ENABLE_MOBILE_APP_SWITCH=true
APP_CONFIG_OAUTH2_IMPLICIT_FLOW=true
APP_CONFIG_OAUTH2_SILENT_LOGIN=true
APP_CONFIG_OAUTH2_REDIRECT_LOGOUT=/
APP_CONFIG_OAUTH2_REDIRECT_LOGIN=/
APP_CONFIG_OAUTH2_REDIRECT_SILENT_IFRAME_URI="{protocol}//{hostname}{:port}/assets/silent-refresh.html"

 # Download Prompt configurations
APP_CONFIG_ENABLE_DOWNLOAD_PROMPT=true
APP_CONFIG_ENABLE_DOWNLOAD_PROMPT_REMINDERS=true
APP_CONFIG_DOWNLOAD_PROMPT_DELAY=<time>
APP_CONFIG_DOWNLOAD_PROMPT_REMINDER_DELAY=<time>
APP_CONFIG_ENABLE_FILE_AUTO_DOWNLOAD=true
APP_CONFIG_FILE_AUTO_DOWNLOAD_SIZE_THRESHOLD_IN_MB=<file-size>
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
