FROM node:16.14-alpine as build-stage
COPY ./ /usr/src/web
WORKDIR /usr/src/web
RUN npm ci  && npm run build

FROM nginx:1.23.3-alpine-slim
COPY --from=build-stage /app/build/ /usr/share/nginx/html