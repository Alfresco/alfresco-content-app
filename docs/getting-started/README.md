---
Title: Getting started
Github only: true
---

# Getting Started

Learn how to start developing with the Alfresco Content Application.

> For Microsoft Windows, please refer to [Windows Support](/getting-started/windows) article.

## Prerequisites

| Name | Version |
| --- | --- |
| [Node.js](https://nodejs.org/en/download) | 18.x (see [Node Version Manager](/getting-started/nvm)) |
| Npm | 9.x |
| [ADF](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/docs/release-notes/README.md) | 6.2 |
| [ACS]((https://www.alfresco.com/products/community/download) | 7.4 |

## Building from source

Install the Nx tool (see more at [Nx.dev](https://nx.dev/))

```sh
npm install -g @nrwl/cli
```

Clone the project:

```sh
git clone https://github.com/Alfresco/alfresco-content-app.git
cd alfresco-content-app
```

In the project root folder, create an `.env` file with the following settings:

```yml
BASE_URL="<URL>"
```

Where `<URL>` points to your ACS backend.

Install dependencies and run:

```sh
npm install
npm start
```

## See Also

- [Node Version Manager](/getting-started/nvm)
- [Internationalization (i18n)](/getting-started/internationalization)
- [CORS](/getting-started/cors)
- [Single Sign-On](/getting-started/sso)
- [Navigation](/getting-started/navigation)
- [Using local ADF](/getting-started/using-local-adf)
- [Docker Support](/getting-started/docker)
- [Windows Support](/getting-started/windows)
