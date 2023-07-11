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

## Containerized Deployment

Typically, you do not need changing application configuration when running ACA in the containerized deployment scenario.
All defaults are already preconfigured and pointing to the locally running Nginx proxy.

Please refer to [ACS Deployment](https://github.com/Alfresco/acs-deployment)
and [ACS Docker Compose](https://github.com/Alfresco/acs-deployment/tree/master/docs/docker-compose) for more details.

## Building manually

Update `dist/content-ce/app.config.json` if needed.

```shell
# cleanup previous
docker rmi -f alfresco/alfresco-content-app

# build
docker build -t alfresco/alfresco-content-app .
```

You can now run this locally:

```shell
docker run --rm -it --user 1000:1000 --publish 8081:8080 alfresco/alfresco-content-app
```

Navigate to `http://localhost:8081`.
