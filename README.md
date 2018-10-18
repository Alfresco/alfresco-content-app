   <p align="left"> <img title="Alfresco" src="alfresco.png" alt="Alfresco - make business flow"></p>
   
# Example Content Application

Testing Supported By<br/>
<img width="160" src="docs/images/Browserstack-logo.svg" alt="BrowserStack"/>

## Introduction

The Alfresco Content Application is an example application built using
[Alfresco Application Development Framework (ADF)](https://github.com/Alfresco/alfresco-ng2-components) components and was generated with [Angular CLI](https://github.com/angular/angular-cli).

### Who is this example application for

This project demonstrates how to construct an application for Alfresco Content Services using the Alfresco ADF and it represents a meaningful composition of ADF components that provide end users with a simple easy to use interface for working with files in the content repository.

### Where to get help
There are a number of resources available to help get you started with the Content App and the ADF:
* [Content App Documentation](https://alfresco.github.io/alfresco-content-app/)
* [Alfresco ADF Documentation](https://alfresco.github.io/adf-component-catalog/)
* [Alfresco Community](https://community.alfresco.com/)
* [ADF Gitter Channel](https://gitter.im/Alfresco/alfresco-ng2-components)

To get help on Angular CLI use ng help or read the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

### Raising issues and feature requests
Isuses can be raised in GitHub or in the Alfresco JIRA project. 
Please include a clear description, steps to reproduce and screenshots where appropriate.All issues will be reviewed; bugs will be categorized if reproducible and enhancement/feature suggestions will be considered against existing priorities if the use case serves a general-purpose need.

#### Features added in the latest release
* Application Extensibility - Phase 2 
  * Document list presets
  * File viewer actions
  * Create menu button
  * Application header
  * Metadata card configuration
  * see [Documentation](https://alfresco.github.io/alfresco-content-app/#/extending) for details.
* Sharing Files
  * Set expiry date for shared links
  * Right click action to access shared link settings
  * Automatic disable of sharing based on respository configuration

Please refer to the [release notes](https://github.com/Alfresco/alfresco-content-app/releases) for details of all changes.

#### High level features planned for H2 2018 (July - December)
* Library Management
  * For end users: Find, join and favorite libraries
  * For managers: Create libraries, manage users and requests to join

### Want to help?
Want to file a bug, contribute some code, or improve documentation? Excellent! Read up on our guidelines for [contributing](https://github.com/Alfresco/alfresco-content-app/blob/master/CONTRIBUTING.md) and then check out one of our issues in the [Jira](https://issues.alfresco.com/jira/projects/ACA) or [GitHub](https://github.com/Alfresco/alfresco-content-app/issues)

## Available Features
| Feature          | Description                                                    | 
|------------------|----------------------------------------------------------------|
| Document List    | Folder/File browsing of Personal Files, and File Libraries     |
| Shared Files	   | Lists all files that have shared.                              |
| Recent Files	   | List files created and/or modified by the logged users within the last 30 days|
| Favorites	       | Lists all favorited files for the user. |
| Trash	           | Lists all deleted items stored in the trash can, users can restore or permanently remove. Admin user will see items deleted by all users.|
| Upload	       | Files and folders can be uploaded through the New button or by dragging and dropping into the browser.|
| Search	       | Quick search with live results, and full faceted search results page.| 
| Actions	       | A number of actions can be performed on files and/or folders, either individually or multiples at a time|
| Viewer           | Viewing files in natively in the browser, unsupported formats are transformed by the repository |                  
| Metadata	       | The information drawer can be configured in the app.config.json to display metadata information, by default file the Properties Aspect is shown and images will also include EXIF information.|
| Versioning	   | The version manager provides access and management of previous file versions, and the ability to upload new versions.|

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

[contributing]: https://github.com/Alfresco/alfresco-content-app/blob/master/CONTRIBUTING.md
[github]: https://github.com/Alfresco/alfresco-content-app/issues
[jira]: https://issues.alfresco.com/jira/projects/ACA
