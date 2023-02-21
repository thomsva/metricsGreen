# Dockerfile for production

FROM node:18.14-alpine as build-stage

ARG REACT_APP_ENV=prod
ENV REACT_APP_ENV=$REACT_APP_ENV
ARG REACT_APP_SERVER_URL
ENV REACT_APP_SERVER_URL=$REACT_APP_SERVER_URL
ARG REACT_APP_SERVER_PORT
ENV REACT_APP_SERVER_PORT=$REACT_APP_SERVER_PORT

WORKDIR /app
COPY package*.json /app/
RUN npm ci
COPY ./ /app/
RUN npm run build




FROM nginx:1.23.3-alpine-slim
ENV NGINX_PORT 80
ENV API_URL https://host.docker.internal:8080
COPY --from=build-stage /app/nginx/ /etc/nginx/templates/
COPY --from=build-stage /app/build/ /usr/share/nginx/html