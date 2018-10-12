---
---

# Docker

The ACA comes with the ACS 6.0 Community Edition preconfigured.
The application runs in two modes:

- Development (runs latest source code, requires building application)
- Preview (runs with latest published containers, master branch)

## Development Mode

Run the local instance of the application packaged into the docker image together with the ACS images:

```sh
npm run build
npm run start:docker
```

The ACA runs on port `4000` when served from within container.

Use the following command to stop all the containers:

```sh
npm run stop:docker
```

## Preview Mode

<p class="tip">
With this mode, you do not need building application from source code or installing dependencies.
</p>

To run the latest published container go to the `docker-compose` folder and start docker compose from there:

```sh
cd docker-compose
docker-compose up
```

The application is available at the `http://localhost:3000` address.
