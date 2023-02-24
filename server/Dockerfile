FROM node:16.14-alpine3.14
COPY ./ /usr/src/server
WORKDIR /usr/src/server
EXPOSE 4000

ARG DB_HOST
ARG DB_PORT
# ENV DB_HOST $DB_HOST
# ENV DB_PORT: $DB_PORT



# Checks if node_modules exist
# If not, install before starting
CMD [ -d "node_modules" ] && npm run dev || npm ci && npm run dev

