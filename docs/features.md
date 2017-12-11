# Features

The concept of this example is a simple user interface which makes accessing files in the Alfresco Content Services repository easy.

Often Content Management systems provide more capabilities out of the box than most users need;
providing too many capabilities to these users prevents them from working efficiently,
so they may end up using unsanctioned file management solutions which presents a proliferation of content storage
and collaboration solutions as well as compliance issues for organisations.

This application demonstrates how the complexity of Content Management can be simplified
using the Alfresco Application Development Framework to easily and quickly create custom solutions for specific user cases.

## User Interface - layout

![](images/features-01.png)

### Header (1)

The application [header](https://github.com/Alfresco/alfresco-content-app/tree/master/src/app/components/header) has three main elements.

Logo & app primary color - logo and color are configurable by updating the
[app.config.json](https://github.com/Alfresco/alfresco-content-app/blob/master/src/app.config.json) file in the root folder of the project,
see [How to change the logo and color](/) and [Application Configuration](/configuration) for more information

[Search](https://github.com/Alfresco/alfresco-content-app/tree/master/src/app/components/search) -
utilizing the [ADF Search Component](https://github.com/Alfresco/alfresco-ng2-components/tree/master/lib/content-services/search)
the app provides a 'live' search feature, where users can open files and folders directly from the Search API results.

[Current User](https://github.com/Alfresco/alfresco-content-app/tree/development/src/app/components/current-user) -
displays the user's name, and a menu where users can logout.
Optionally through updating the [app.config.json](https://github.com/Alfresco/alfresco-content-app/blob/master/src/app.config.json)
a language switching menu can be displayed.

### Side Nav (2)

The application [side navigation](https://github.com/Alfresco/alfresco-content-app/tree/master/src/app/components/sidenav) has two features;
a button menu and navigation links.
The New button displays a menu which allows users to create a new folder, upload a file, and upload a folder.
The navigation links are configurable via the [app.config.json](https://github.com/Alfresco/alfresco-content-app/blob/master/src/app.config.json).
Default configuration creates two sections.

### Document List Layout (3)

The main area of the application is composed from a number of individual ADF components:

- [Breadcrumb](https://github.com/Alfresco/alfresco-ng2-components/tree/master/lib/content-services/breadcrumb)
- [Toolbar](https://alfresco.github.io/adf-component-catalog/components/ToolbarComponent.html)
- [Document List](https://alfresco.github.io/adf-component-catalog/components/DocumentListComponent.html)
- [Pagination](https://alfresco.github.io/adf-component-catalog/components/PaginationComponent.html)

The application has six different Document List views which contain subtle differences depending on the content being loaded.

#### Personal Files

Personal Files retrieves all content from the logged in users home area (`/User Homes/<username>/` in the repository);
if the user is ‘admin’ who does not have a home folder then the repository root folder is shown.

Personal Files is the [Files component](https://github.com/Alfresco/alfresco-content-app/tree/development/src/app/components/files),
using the [Nodes API](https://api-explorer.alfresco.com/api-explorer/#/nodes).

#### File Libraries

File Libraries retrieves all the sites that the user is a member including what type of site it is; public, moderated or private.
File Libraries is the [Libraries component](https://github.com/Alfresco/alfresco-content-app/tree/development/src/app/components/libraries),
using the [Sites API](https://api-explorer.alfresco.com/api-explorer/#/sites).

When a user opens one of their sites then the content for that sites document library is shown.
To display the files and folders from a site (`/Sites/<siteid>/Document Library/`) the [Files component](https://github.com/Alfresco/alfresco-content-app/tree/development/src/app/components/files),
using the [Nodes API](https://api-explorer.alfresco.com/api-explorer/#/nodes) is used.
