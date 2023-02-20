# Dockerfile for production

FROM node:18.14-alpine as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm ci
COPY ./ /app/
RUN npm run build

FROM nginx:1.23.3-alpine-slim
COPY --from=build-stage /app/build/ /usr/share/nginx/html