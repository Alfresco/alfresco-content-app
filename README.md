   <p align="left"> <img title="Alfresco" src="alfresco.png" alt="Alfresco - make business flow"></p>
   
# Alfresco Content Application

Testing Supported By<br/>
<img width="160" src="docs/images/Browserstack-logo.svg" alt="BrowserStack"/>

## Introduction

The Alfresco Content Application a file management application built using
[Alfresco Application Development Framework (ADF)](https://github.com/Alfresco/alfresco-ng2-components) components and was generated with [Angular CLI](https://github.com/angular/angular-cli).

### Who is this application for

The Content Application is a streamlined experience for end users on top of Alfresco Content Services, focused on file management within the content repository.  It provides developers with an easily extendable environment for lightening fast custom application development by providing safe ways to inject  custom controls, viewer components, pages and plug-ins without upgrade concerns.

### Where to get help
There are a number of resources available to help get you started with the Content App and the ADF:
* [Content App Documentation](https://alfresco.github.io/alfresco-content-app/)
* [Alfresco ADF Documentation](https://alfresco.github.io/adf-component-catalog/)
* [Alfresco Community](https://community.alfresco.com/)

To get help on Angular CLI use ng help or read the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

### Raising issues and feature requests
Isuses can be raised in GitHub or in the Alfresco JIRA project. 
Please include a clear description, steps to reproduce and screenshots where appropriate.All issues will be reviewed; bugs will be categorized if reproducible and enhancement/feature suggestions will be considered against existing priorities if the use case serves a general-purpose need.

#### Features added in the latest release
* Library Management
  * For end users: Join and favorite libraries
* New search input to find Libraries, files and/or folders
* Updated action toolbar, right click context menu and refresh of some icons

Please refer to the [release notes](https://github.com/Alfresco/alfresco-content-app/releases) for details of all changes.

#### High level feature themes planned for 2019
* Collaboration & File Management
  * Edit offline, and edit online with Alfresco Office Services (AOS)
  * Folder rule creation
  * File/Folder linking via secondary association
* File Library Management
  * For managers: Create libraries, manage users and requests to join
* Single Sign On
  * Support for Alfresco Identity Service
* Enhanced UI and user experiance
  * Search result facet improvements
  * Search query input assistance
  * Metadata information drawer enhancements
  
### Want to help?
Want to file a bug, contribute some code, or improve documentation? Excellent! Read up on our guidelines for [contributing](https://github.com/Alfresco/alfresco-content-app/blob/master/CONTRIBUTING.md) and then check out one of our issues in the [Jira](https://issues.alfresco.com/jira/projects/ACA) or [GitHub](https://github.com/Alfresco/alfresco-content-app/issues)

## Available Features
| Feature          | Description                                                    | 
|------------------|----------------------------------------------------------------|
| My Files    | Folder/File browsing of Personal Files.|
| File Libraries | Create, find, join and browse the file libraries of sites created in the repository.|
| Shared Files	   | Lists all files that have shared.                              |
| Recent Files	   | List files created and/or modified by the logged users within the last 30 days.|
| Favorites	       | Lists all favorited files for the user. |
| Trash	           | Lists all deleted items stored in the trash can, users can restore or permanently remove. Admin user will see items deleted by all users.|
| Upload	       | Files and folders can be uploaded through the New button or by dragging and dropping into the browser.|
| Search	       | Quick search with live results, and full faceted search results page.| 
| Actions	       | A number of actions can be performed on files and/or folders, either individually or multiples at a time.|
| Viewer           | Viewing files in natively in the browser, unsupported formats are transformed by the repository. |       
| Metadata	       | The information drawer can be configured in the app.config.json to display metadata information, by default file the Properties Aspect is shown and images will also include EXIF information.|
| File Sharing	   | Share files, with time expiry if required, externally with uniquely generated URLs.|
| Versioning	   | The version manager provides access and management of previous file versions, and the ability to upload new versions.|
| Permissions	   | Granular user permission management of the folders and files throughout the repository.|
| Extensibility	   | The application provides safe extension points allowing full customiation; see [Documentation](https://alfresco.github.io/alfresco-content-app/#/extending) for details. |


## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

[contributing]: https://github.com/Alfresco/alfresco-content-app/blob/master/CONTRIBUTING.md
[github]: https://github.com/Alfresco/alfresco-content-app/issues
[jira]: https://issues.alfresco.com/jira/projects/ACA
