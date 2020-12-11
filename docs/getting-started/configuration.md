---
Title: Configuration
---

# Configuration

The Alfresco Content Application provides support for the global settings file `app.config.json` that you can use to customize the behavior of the Content Application and ADF components.

## Server settings

Once the Content Application starts, it needs to know where the Alfresco Content Services server is, and what the file sharing URL will be.

### Content Services Address

The "ecmHost" property allows you to set the address of the server using the dynamic or static format.

#### Dynamic address

The example below demonstrates the most common dynamic format for a development environment:

```json
{
    "ecmHost": "http://{hostname}{:port}"
}
```

The configuration above assumes you are running ACS and the Alfresco Content Application on the same server and port
and allows deploying to different servers having the same unified configuration file.

For example, a proxy server at `localhost:4200` hosting the Alfresco Content Application as the root application,
and `localhost:4200/alfresco` for the ACS repository.

At runtime, the application is going to automatically substitute the "{hostname}" value with the original hostname.
Optionally it can also use the value of the original port if present, for example, "4200" at local machines, or skip the value for port 80.

#### Static address

Alternatively, you can provide a static address for the ACS server if necessary:

```json
{
    "ecmHost": "http://localhost:4200"
}
```

### Shared Files Address

The "baseShareUrl" property tells the application how to construct the address where users will access shared files.

```json
{
  "baseShareUrl": "{protocol}//{hostname}{:port}/#/preview/s"
}
```

## Application settings

There are many settings you can change to alter the default behavior of the application.

### Application Name

The following block allows you to change the name of the application.

```json
{
    "application": {
        "name": "Alfresco Example Content Application"
    }
}
```

The value of the `application.name` key gets appended to every browser tab title at runtime
with the format `[page title] - [application name]`,
for example: "Personal Files - Alfresco Example Content Application".

### Application Logo

The default logo displayed in the top left corner of the Alfresco Content Application can be changed:

1. Place your custom logo image file in the [app-name]/src/assets/images folder. The displayed image will resize automatically, an image with extreme width/height might not retain its dimensions.

2. In the app.config.json file, set the value of the application.logo to contain the name of the custom logo image: "logo": "/assets/images/[image-name].[extension]"

```json
{
    "application": {
        "logo": "/assets/images/alfresco-logo-white.svg"
    }
}
```

### Header Background color

You can change the header background color by specifying the color code for the "headerColor" key:

```json
{
    "application": {
      "headerColor": "#ffffff"
    }
}
```

### Header background image

You can change the header background image by specifying the path to the corresponding resource:

```json
{
    "application": {
      "headerImagePath": "assets/images/mastHead-bg-shapesPattern.svg"
    }
}
```

### Restricted content

You can restrict users from uploading certain types of files and folders by setting or extending the list of rules at the "files.excluded" path.

By default, the application ships with the following rules already predefined:

```json
{
    "files": {
        "excluded": [
            ".DS_Store",
            "desktop.ini",
            "thumbs.db",
            ".git"
        ]
    }
}
```

**Tip:** You can find more details on the supported rules in the ADF [Upload Service](https://www.alfresco.com/abn/adf/docs/core/services/upload.service/) docs.

### Pagination settings

You can change the default settings of the pagination that gets applied to all the document lists in the application.

```json
{
    "pagination": {
        "supportedPageSizes": [
            25,
            50,
            100
        ]
    }
}
```

## Your custom settings

You can store any information in the application configuration file, and access it at runtime by using the `AppConfigService` service provided by ADF.

**Tip:** Please refer to the ADF
[App Config Service](https://www.alfresco.com/abn/adf/docs/core/services/app-config.service/) documentation to get more details on the Application Configuration features and APIs available.
