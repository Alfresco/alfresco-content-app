## Header

The application [header](https://github.com/Alfresco/alfresco-content-app/tree/master/src/app/components/header) has three main elements.

![](images/header.png)

### Logo and Color
Logo & app primary color - logo and color are configurable by updating the
[app.config.json](https://github.com/Alfresco/alfresco-content-app/blob/master/src/app.config.json) file in the root folder of the project,
see [How to change the logo and color](/) and [Application Configuration](/configuration) for more information

### Search
The applicaton [Search](https://github.com/Alfresco/alfresco-content-app/tree/master/src/app/components/search) -
utilizes the [ADF Search Component](https://github.com/Alfresco/alfresco-ng2-components/tree/master/lib/content-services/search)
the app provides a 'live' search feature, where users can open files and folders directly from the Search API results.

### Current User
[Current User](https://github.com/Alfresco/alfresco-content-app/tree/development/src/app/components/current-user) -
displays the user's name, and a menu where users can logout.
Optionally through updating the [app.config.json](https://github.com/Alfresco/alfresco-content-app/blob/master/src/app.config.json)
a language switching menu can be displayed.
