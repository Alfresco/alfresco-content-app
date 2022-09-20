<p align="left"> <img title="Alfresco" src="alfresco.png" alt="Alfresco - Simply a better way to create amazing digital experiences"></p>

# Alfresco Content Application

## Requirements

| Name | Version |
| --- | --- |
| Node.js | 14.x |
| Npm | 6.x |

## Running

Create an `.env` file in the project root folder with the following content

```yml
APP_CONFIG_ECM_HOST="<URL>"
APP_CONFIG_PLUGIN_AOS=false
APP_CONFIG_PLUGIN_CONTENT_SERVICE=true
APP_CONFIG_PLUGIN_FOLDER_RULES=true
```

Where `<URL>` is the address of the ACS.

Run the following commands:

```sh
npm install
npm start content-ce
```

### Using Local ADF

Clone the `alfresco-ng2-components` and `alfresco-content-app` repositories in the same folder, and run the following command:

```sh
npm start content-ce -- --configuration=adf
```

Changing the ADF code results in the recompilation and hot-reloading of the ACA application.

## See Also

Please refer to the [Public documentation](https://alfresco-content-app.netlify.com/) for more details
