FROM node:18.14-alpine3.17
COPY ./ /usr/src/server
WORKDIR /usr/src/server
EXPOSE 4000

ARG DB_HOST
ARG DB_PORT

# Checks if node_modules exist
# If not, install before starting
CMD [ -d "node_modules" ] && npm run dev || npm ci && npm run dev

