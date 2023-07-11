# Docker Support

Running local build with Docker

```shell
npm run build
```

The application is already preconfigured to run alongside backend containers within the Docker Compose.

If you need to provide custom settings, update `dist/content-ce/app.config.json` file.
See [Configuration](/configuration/) section for more details

Build and run the container:

```shell
./docker/run.sh
```

The application is configured to run at `http://localhost:8081`.
