# Using with Docker

<p class="warning">
This article assumes you are familiar with Docker and know how to create images and containers.
</p>

You can create a Docker image to run Alfresco Content App in the container.

## Building from source code

You need to run the following commands to build the project from the source code:

```sh
npm install
npm run build
```

That produces a build in the "dist" folder that you can use with a Docker image.

<p class="tip">
Also, you may need to update the `dist/app.config.json` file with the settings relevant to your scenario.
</p>

## Creating an image

The Content Application provides a "Dockerfile" file in the repository root.
You can build the image with the following command:

```sh
docker image build -t content-app .
```

## Running image in a container

To run the image locally, you can use the following command:

```sh
docker container run -p 80:80 --rm content-app
```

Navigate to "http://localhost" to access the running application.

## Docker Compose file

You can also use the "docker-compose" file for local development and testing.
To build and run a container run the following command in the root project folder:

```sh
docker-compose up
```

To perform a cleanup operation, use the next command:

```sh
docker-compose down --rmi all
```

Navigate to "http://localhost:3000" to access the running application.

<p class="warning">
Please keep in mind that you should manually build the project every time you want to publish the image or run it locally with the container.
</p>

## Using with local ACS setup

If you run ACS at port 8080 as a Docker container (typical development configuration), you can use the following command to build the project before creating an image:

```sh
npm run build:dev
```

The command above updates the "dist/app.config.json" file to point the Content App to "http://localhost:8080" upon startup.
Alternatively, you can change the configuration file manually before generating an image.

So, the development workflow, in this case, is going to be:

```sh
npm run build:dev
docker-compose up
```

Navigate to "http://localhost:3000" to access the running application.

To perform a cleanup operation, use the next command:

```sh
docker-compose down --rmi all
```

## Publishing to Docker Hub

First of all, if you do not have a Docker Hub account, you can register here: https://hub.docker.com/, the registration is absolutely free.

Next, it is recommended that you get a clean build of the application:

```sh
npm install
npm run build:dev
```

The commands above are going to produce a fresh build that is stored in the `dist` folder.
At this point, you can make modifications to the final code in the `dist` folder if needed.
For example you may want to change the `app.config.json` file content.

Now you can build your first version of the image:

```sh
docker image build -t myaccount/content-app:1.0 .
```

Where `myaccount` is usually your Docker Hub account name.

<p class="warning">
Please note the ending "." symbol at the end of the command. It instructs the Docker to take current folder where the `Dockerfile` is located.
</p>

To publish the newly created image use the next command:

```sh
docker push myaccount/content-app:1.0
```

## Running from Docker Hub

To quickly test the published image, or run it on another machine, use the following command:

```sh
docker container run -p 80:80 --rm myaccount/content-app:1.0
```

The `--rm` switch means the Docker will cleanup the container and image data once you stop the process.

<p class="tip">
You may also want to remove your local image before trying out the Docker Hub:<br>
`docker image rm myaccount/content-app:1.0`
</p>
