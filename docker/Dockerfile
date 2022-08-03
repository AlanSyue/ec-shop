FROM node:14-alpine As base
WORKDIR /app
COPY ../app/package.json .
RUN yarn install

FROM node:14-alpine As dev
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
EXPOSE 3000
