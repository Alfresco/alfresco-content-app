---
Title: How to install an existing extension
---

The purpose of this tutorial is to describe how to install an existing extension for the [Alfresco Content Application (aka ACA)](https://github.com/Alfresco/alfresco-content-app "https://github.com/Alfresco/alfresco-content-app"). The [ACA extension mechanism](https://alfresco-content-app.netlify.app/#/extending/ "https://alfresco-content-app.netlify.app/#/extending/") is the suggested way to customise the ADF-based front-end applications and this tutorial should help in this relevant task to manage extensions.

# Prerequisites

The starting point for this tutorial is the availability of a tested and working ACA extension as well as the full repository of the [Alfresco Content Application (aka ACA)](https://github.com/Alfresco/alfresco-content-app "https://github.com/Alfresco/alfresco-content-app"). This tutorial has been written with the following versions of the software:
-   ACA version 2.2.0,
-   ACS 7.0.0-M3,
-   NodeJs version 14.15.2,
-   Chrome Version 87.0.4280.88.

In this tutorial it is assumed that the existing ACA extension is named `my-extension` and its structure is compliant with the content and structure of the `projects/my-extension` path described in the tutorial [here](how-to-create-your-first-extension.md "how-to-create-your-first-extension.md").

# Installing the ACA extension

The idea behind this task is to create a brand new ACA extension with the same name of the existing one, and replace its content to reach the described goal.

From the root folder of the ACA project, launch the command below from a terminal. Please be sure that you are going to use the same name as the existing extension (in this case my-extension).

    ng generate library my-extension

In case of errors, add the following line to the `tsconfig.json` file.  

    "compilerOptions": { "baseUrl": ".", "rootDir": "." }

Once done, delete the full content of the `projects/my-extension` folder and replace it with the source code of the existing ACA extension.

To complete the creation, build the extension launching the following command.

    ng build my-extension

In case of errors, add the following configuration to the `tsconfig.json` file.  

    "compilerOptions": { ..., "allowSyntheticDefaultImports":true }

# Making the extension as part of the ACA application

Now that the ACA extension is developed in its initial version, let's add the extension module to the list of the ones used by the application. To complete the task you can follow the same task described for the tutorial named [How to create your first extension for the Alfresco Content Application (aka ACA)](how-to-create-your-first-extension.md) (paragraph “Making the extension as part of the ACA application“). Once the extension is installed with success (`npm install my-extension`), the task can be considered as completed.

# Running ACA with the extension included

Now that everything is properly developed, it’s time to launch ACA and see the result. To launch ADW, run the following command from a terminal.

    npm start

What you should see is a new item in left menu of the landing page for ACA, implementing the route to a new page with the following content. Below the screenshot describing what it should look like.

![extension](../images/extension-02.png)