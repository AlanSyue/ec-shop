FROM node:14-alpine As base
WORKDIR /app
COPY ../app/package.json .
COPY ../app/yarn.lock .
RUN yarn install

FROM node:14-alpine As dev
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
RUN yarn global add ts-node \
    yarn global add cross-var
EXPOSE 3000
