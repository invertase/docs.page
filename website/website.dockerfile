# base node image
FROM node:16-bullseye-slim as base

ARG ROOT_DIR=default_value
ARG BUILD_SHA=default_value
ENV __BUILD_SHA=$BUILD_SHA
ENV __ROOT_DIR=$ROOT_DIR

# Install all node_modules, including dev dependencies
FROM base as deps

RUN mkdir /app
WORKDIR /app

ADD $ROOT_DIR/package.json $ROOT_DIR/package-lock.json ./
RUN npm install --production=false

# Setup production node_modules
FROM base as production-deps

RUN mkdir /app
WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
ADD $ROOT_DIR/package.json $ROOT_DIR/package-lock.json ./
RUN npm prune --production

# Build the app
FROM base as build

RUN mkdir /app
WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

ENV NODE_ENV=production

RUN mkdir /app
WORKDIR /app

COPY --from=production-deps /app/node_modules /app/node_modules
#My build goes to /app/server/build and i'm running /server/index.js express
COPY --from=build /app/server /app/server
COPY --from=build /app/public /app/public
ADD . .

CMD ["npm", "run", "start"]