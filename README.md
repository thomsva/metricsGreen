# metricsGreen

[![ESLint](https://github.com/thomsva/metricsGreen/actions/workflows/eslint.yml/badge.svg)](https://github.com/thomsva/metricsGreen/actions/workflows/eslint.yml)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

[![CI/CD pipeline server](https://github.com/thomsva/metricsGreen/actions/workflows/deploy-server.yml/badge.svg)](https://github.com/thomsva/metricsGreen/actions/workflows/deploy-server.yml)

[![CI/CD pipeline web](https://github.com/thomsva/metricsGreen/actions/workflows/deploy-web.yml/badge.svg)](https://github.com/thomsva/metricsGreen/actions/workflows/deploy-web.yml)

[Hours log](hours.md)

## Development

Start the development environment by switching to the project directory and
then:

```
docker-compose up
```

This starts the web, server, db and adminer services in their own containers.
The first run takes longer because docker downloads and installs everything. The
node_modules folders are reflected to the host machine so no need to run npm
install.

The web and server containers are hot-loading on code change.

## Testing locally

Switch to the /app-test directory and start the test version of the application.
The test version of the application has to be up and running before running
test. Start the test version of the application using the following command
(while in /app-test).

```
docker-compose up web server db
```

It works well to leave the test version of the application running as changes to
the code are updating automatically. The development version can be running at
the same time as the services are mapped to different ports.

Cypress running in it's own container can be started using the following
commands to not use the env settings from docker.compose.override.yml:

```
docker-compose -f docker-compose.yml up web server db
docker-compose -f docker-compose.yml up cypress
```

For development purposes it can be more convenient to use Cypress user interface
on the host machine instead of running Cypress in a container. While keeping the
test application running, install and run Cypress using:

```
npm i
npx cypress open
```

To run tests in headless mode (like in CI) use this:

```
npx cypress run
```
