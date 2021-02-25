---
Title: Docker
---

# Docker

ACA comes with the ACS 6.0 Community Edition preconfigured.

The application runs in two modes:

- Development (runs latest source code, requires building application)
- Preview (runs with latest published containers, master branch)

## Development Mode

Run the local instance of the application packaged into the docker image together with the ACS images:

```sh
npm run build.release
npm run start:docker
```

The ACA runs on port `8080` when served from within container.

Use the following command to stop all the containers:

```sh
npm run stop:docker
```

You can also develop the application and run in default port (4200),
it is going to use the same docker containers automatically.
