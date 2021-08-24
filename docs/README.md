---
Title: Alfresco Content Application
Github only: true
---

# Alfresco Content Application

<!-- markdownlint-disable MD033 -->

The Alfresco Content Application a file management application built using
[Alfresco Application Development Framework (ADF)](https://www.alfresco.com/abn/adf/docs) components and was generated with [Angular CLI](https://github.com/angular/angular-cli).

## Who is this application for

The Content Application is a streamlined experience for end users on top of Alfresco Content Services, focused on file management within the Alfresco content repository. It provides developers with an easily extendable environment for lightning fast custom application development by providing safe ways to inject custom controls, viewer components, pages and plug-ins without upgrade concerns.

## Where to get help

There are a number of resources available to help get you started with the Content App and the ADF:

- [Gitter Chat](https://gitter.im/Alfresco/content-app) - Developer community chat
- [Content App Documentation](https://alfresco-content-app.netlify.app/) - Developer documentation
- [Alfresco ADF Documentation](https://www.alfresco.com/abn/adf/) - Application Development Framework documentation
- [Alfresco Community Portal](https://community.alfresco.com/) - Developer Community Forums
- [Alfresco Customer Support](https://support.alfresco.com/) - Customer support for the Alfresco Digital Workspace

## Documentation

The documentation is divided into the following sections:

- [Application features](/features/): Details of the user interface and app usage.
- [Getting started](/getting-started/): Configuration of the development environment and the app.
- Customization:
  - [Configuration](/configuration/): How to customize basic functionality of the app without touch the code. 
  - [Extending](/extending/): How to extend the features of the app with your own code.
- [Tutorials](/tutorials/): Exploration of development techniques in depth.
- [Help](/help): Details of further help and support available.

## Compatibility

| ACA Version | Built with | Tested on |
| ----------- | ---------- | --------- |
| ACA 2.4.0    | ADF 4.4.0  | ACS 6.2   |
| ACA 2.3.0    | ADF 4.3.0  | ACS 6.2   |
| ACA 2.2.0    | ADF 4.2.0  | ACS 6.2   |
| ACA 2.1.0    | ADF 4.1.0  | ACS 6.2   |
| ACA 1.12    | ADF 3.9.0  | ACS 6.2   |
| ACA 1.11    | ADF 3.8.0  | ACS 6.2   |
| ACA 1.10    | ADF 3.7.0  | ACS 6.2   |
| ACA 1.9     | ADF 3.6.0  | ACS 6.2   |
| ACA 1.8     | ADF 3.3.0  | ACS 6.1   |
| ACA 1.7     | ADF 3.0.0  | ACS 6.1   |
| ACA 1.6     | ADF 2.6.1  | ACS 6.1   |
| ACA 1.5     | ADF 2.6.0  | ACS 6.0   |
| ACA 1.4     | ADF 2.5.0  | ACS 6.0   |
| ACA 1.3     | ADF 2.4.0  | ACS 6.0   |
| ACA 1.2     | ADF 2.3.0  | ACS 5.2   |
| ACA 1.1     | ADF 2.2.0  | ACS 5.2   |
| ACA 1.0     | ADF 2.0.0  | ACS 5.2   |

## Available Features

| Version | Feature                            | Description                                                                                                                                                                                    |
| ------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.5     | My Files                           | Folder/File browsing of Personal Files.                                                                                                                                                        |
| 1.5     | File Libraries                     | Create, find, join and browse the file libraries of sites created in the repository.                                                                                                           |
| 1.5     | Shared Files                       | Lists all files that have shared.                                                                                                                                                              |
| 1.5     | Recent Files                       | List files created and/or modified by the logged users within the last 30 days.                                                                                                                |
| 1.5     | Favorites                          | Lists all favorite files for the user.                                                                                                                                                         |
| 1.5     | Trash                              | Lists all deleted items stored in the trash can, users can restore or permanently remove. Admin user will see items deleted by all users.                                                      |
| 1.5     | Upload                             | Files and folders can be uploaded through the New button or by dragging and dropping into the browser.                                                                                         |
| 1.5     | Search                             | Quick search with live results, and full faceted search results page.                                                                                                                          |
| 1.5     | Actions                            | A number of actions can be performed on files and/or folders, either individually or multiples at a time.                                                                                      |
| 1.5     | Viewer                             | Viewing files in natively in the browser, unsupported formats are transformed by the repository.                                                                                               |
| 1.5     | Metadata                           | The information drawer can be configured in the app.config.json to display metadata information, by default file the Properties Aspect is shown and images will also include EXIF information. |
| 1.5     | File Sharing                       | Share files, with time expiry if required, externally with uniquely generated URLs.                                                                                                            |
| 1.5     | Versioning                         | The version manager provides access and management of previous file versions, and the ability to upload new versions.                                                                          |
| 1.5     | Permissions                        | Granular user permission management of the folders and files throughout the repository.                                                                                                        |
| 1.5     | Extensibility                      | The application provides safe extension points allowing full customisation; see [Documentation](https://alfresco-content-app.netlify.com/#/extending/) for details.                            |
| 1.6     | Library management                 | Join and favorite libraries. New search input to find Libraries, files and/or folders.                                                                                                         |
| 1.7     | Edit Offline                       | Lock and unlock for editing, download current version, upload new version.                                                                                                                     |
| 1.7     | Edit with Microsoft Office         | Extension to edit online with Alfresco Office Services (AOS)                                                                                                                                   |
| 1.7     | Single Sign-On (SSO)               | Support for Alfresco Identity Service, with ADF 3.0.0                                                                                                                                          |
| 1.7     | Search Query Language              | Enhanced search input using the Alfresco Search Query Language                                                                                                                                 |
| 1.8     | Localizations .                    | Arabic, Czech, Danish, Finnish, Polish and Swedish                                                                                                                                             |
| 1.8     | Metadata improvements              | Automatic display of aspects and properties                                                                                                                                                    |
| 1.8     | Search facet improvements          | Facet intervals and grouped facet queries                                                                                                                                                      |
| 1.8     | Extensibility improvements         | Various - see [release notes](https://github.com/Alfresco/alfresco-content-app/releases) for details                                                                                           |
| 1.9     | Single Log Out                     | Users will be automatically logged out from the Content App after logging out from another application in the same browser session                                                             |
| 1.9     | Accessibility improvements         | Various - see [release notes](https://github.com/Alfresco/alfresco-content-app/releases) for details                                                                                           |
| 1.10    | Create (file/folder) from template | Users can create files and folders structures from pre-set templates                                                                                                                           |

For the full list of features please refer to the [Releases](https://github.com/Alfresco/alfresco-content-app/releases).

## Raising issues and feature requests

Issues can be raised in [GitHub] or in the Alfresco JIRA project.
Please include a clear description, steps to reproduce and screenshots where appropriate. All issues will be reviewed; bugs will be categorized if reproducible and enhancement/feature suggestions will be considered against existing priorities if the use case serves a general-purpose need.

## How to contribute

Want to file a bug, contribute some code, or improve documentation? Excellent!
Read up on our guidelines for [contributing][contributing]
and then check out one of our issues in the [Jira][jira] or [GitHub][github]

### How long will it take for my contribution to be reviewed

The time necessary for a code review will vary, smaller changes may be reviewed within days, while larger changes may take longer.

[contributing]: https://github.com/Alfresco/alfresco-content-app/blob/master/CONTRIBUTING.md
[github]: https://github.com/Alfresco/alfresco-content-app/issues
[jira]: https://issues.alfresco.com/jira/projects/ACA
[release notes]: https://github.com/Alfresco/alfresco-content-app/releases
