# ec-shop

- [Technical usage](#technical-usage)
- [CI/CD](#cicd)
- [Requirement](#requirement)
- [Getting Started](#getting-started)
- [API document](#api-document)
- [Sequence](#sequence)
- [Automated test](#automated-test)

<a name="technical-usage"></a>
# Technical usage

| Technical requirements |   Usage   |
|:----------------------:|:---------:|
| API Service            | NestJS    |
| Database               | MySQL     |
| Test Framework         | Jest      |
| API document           | Stoplight |
| Version Control        | Git       |
| Hosting                | Linode    |
| CI/CD                  | GitHub Action    |


<a name="cicd"></a>
# CI/CD
## Use GitHub Action
see [link](https://github.com/AlanSyue/ec-shop/actions)

<a name="requirement"></a>
# Requirement
docker and docker-compose: https://www.docker.com/products/docker-d

<a name="getting-started"></a>
# Getting Started
1. Set up the container
```bash
$ cp docker/.env.example docker/.env
$ docker-compose -f ./docker/docker-compose.yml --env-file ./docker/.env up -d
```

2. Run database migrations
```bash
$ cp app/.env.example app/.env
$ cd docker/
$ docker compose exec app sh
$ yarn migration:run
```

3. Start the API server
```bash
$ yarn start:dev
```

<a name="api-document"></a>
# API document
see [Stoplight](https://ecshop.stoplight.io/docs/ecshoop/k4ozm8ycdxtat-auth)

## How to use API document
### Choose the API
![test](https://user-images.githubusercontent.com/33183531/183269655-b074e383-a7df-4030-be4b-945afc085327.gif)

## API information
<img width="1434" alt="截圖 2022-08-07 上午8 09 29" src="https://user-images.githubusercontent.com/33183531/183269712-e82198a6-b4a6-4c28-89a8-493a7c1a4694.png">

## Test the API after you start the server
![test](https://user-images.githubusercontent.com/33183531/183269921-b8b77cb8-c540-4e00-91c1-151829c9f07b.gif)


<a name="sequence"></a>
# Sequence
1. Sign up the account
```console
curl --request POST \
  --url https://ec.newideas.com.tw/auth/signup \
  --header 'Content-Type: application/json' \
  --data '{
  "email": "b123105@gmail.com",
  "password": "123456"
}'
```
![singup](https://user-images.githubusercontent.com/33183531/183271044-d2f02953-af6d-4b85-ba65-a9cb2f7cbffd.png)

2. Login and get the access token
```console
curl --request POST \
  --url https://ec.newideas.com.tw/auth/login \
  --header 'Content-Type: application/json' \
  --data '{
  "email": "b123105@gmail.com",
  "password": "123456"
}'
```
![login](https://user-images.githubusercontent.com/33183531/183271342-6bb326d8-4f7c-4731-a070-bc3460bca5bb.png)

3. See your profile
```console
curl --request GET \
  --url https://ec.newideas.com.tw/user/profile \
  --header 'Authorization: Bearer ${your access token}' \
  --header 'Content-Type: application/json'
```
![profile](https://user-images.githubusercontent.com/33183531/183271460-81db4b44-2235-432a-bb4a-8b0d3a7b5dcd.png)

3. See all products in the shop
```console
curl --request GET \
  --url https://ec.newideas.com.tw/product \
  --header 'Content-Type: application/json'
```
![Product](https://user-images.githubusercontent.com/33183531/183271635-bc34793e-623b-4c7a-82d7-9710905bc7ab.png)


4. Add the product to shopping cart
```console
curl --request POST \
  --url https://ec.newideas.com.tw/cart/1 \
  --header 'Authorization: Bearer ${your access token}' \
  --header 'Content-Type: application/json' \
  --data '{
  "amount": 1
}'
```
![AddToCart](https://user-images.githubusercontent.com/33183531/183271864-244b55bf-a819-48f1-8fd6-c1ca610febca.png)

5. See your shopping cart
```console
curl --request GET \
  --url https://ec.newideas.com.tw/cart \
  --header 'Authorization: Bearer ${your access token}' \
  --header 'Content-Type: application/json'
```
![Find Cart](https://user-images.githubusercontent.com/33183531/183271903-77ea71ce-03d3-4a03-8775-b36bdb4274d7.png)

6. Checkout
```console
curl --request POST \
  --url https://ec.newideas.com.tw/cart/checkout \
  --header 'Authorization: Bearer ${your access token}' \
  --header 'Content-Type: application/json'
```
![checkout](https://user-images.githubusercontent.com/33183531/183272133-4223a560-76c7-4b0f-8acc-9a5ac4ec70bb.png)

7. See your orders
```console
curl --request GET \
  --url https://ec.newideas.com.tw/order \
  --header 'Authorization: Bearer ${your access token}' \
  --header 'Content-Type: application/json'
```
![orders](https://user-images.githubusercontent.com/33183531/183272226-cd7d2d7d-25f8-4df1-8dfd-8b39b7e623d4.png)

<a name="automated-test"></a>
# Automated test
## Run unit test
```console
$ cd docker
$ docker compose exec app sh
$ yarn test
```

## See coverage
```console
$ cd docker
$ docker compose exec app sh
$ yarn test:cov
```

--------------------------------|---------|----------|---------|---------|-------------------
File                            | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------------------|---------|----------|---------|---------|-------------------
All files                       |   66.66 |    90.47 |   55.85 |   68.06 |
 src                            |   39.39 |      100 |      75 |   33.33 |
  app.controller.ts             |     100 |      100 |     100 |     100 |
  app.module.ts                 |       0 |      100 |     100 |       0 | 1-26
  app.service.ts                |     100 |      100 |     100 |     100 |
  main.ts                       |       0 |      100 |       0 |       0 | 1-15
 src/auth                       |       0 |      100 |     100 |       0 |
  auth.module.ts                |       0 |      100 |     100 |       0 | 1-26
  constants.ts                  |       0 |      100 |     100 |       0 | 1-3
 src/auth/applications          |     100 |      100 |     100 |     100 |
  auth.controller.ts            |     100 |      100 |     100 |     100 |
 src/auth/dtos                  |   71.42 |      100 |       0 |   71.42 |
  auth-dto.ts                   |   71.42 |      100 |       0 |   71.42 | 22-26
 src/auth/errors                |     100 |      100 |     100 |     100 |
  email-exist-error.ts          |     100 |      100 |     100 |     100 |
 src/auth/services              |     100 |      100 |     100 |     100 |
  auth.service.ts               |     100 |      100 |     100 |     100 |
 src/auth/strategies            |   27.77 |        0 |       0 |   21.42 |
  jwt-auth.guard.ts             |     100 |      100 |     100 |     100 |
  jwt.strategy.ts               |       0 |      100 |       0 |       0 | 1-17
  local-auth.guard.ts           |     100 |      100 |     100 |     100 |
  local.strategy.ts             |       0 |        0 |       0 |       0 | 1-24
 src/cart                       |       0 |      100 |     100 |       0 |
  cart.module.ts                |       0 |      100 |     100 |       0 | 1-16
 src/cart/aggregates            |     100 |      100 |     100 |     100 |
  cart-aggregate.ts             |     100 |      100 |     100 |     100 |
 src/cart/applications          |   87.87 |      100 |     100 |   87.09 |
  cart.controller.ts            |   87.87 |      100 |     100 |   87.09 | 34,48,63,78
 src/cart/dtos                  |     100 |      100 |     100 |     100 |
  cart-dto.ts                   |     100 |      100 |     100 |     100 |
 src/cart/errors                |   88.88 |    66.66 |      50 |   88.88 |
  product-out-of-stock-error.ts |   88.88 |    66.66 |      50 |   88.88 | 19
 src/cart/services              |   81.81 |      100 |      90 |   81.13 |
  cart.service.ts               |   81.81 |      100 |      90 |   81.13 | 100,125-154
 src/entities                   |   69.09 |      100 |    2.85 |      75 |
  cart.entity.ts                |      68 |      100 |       0 |      75 | 23,28,33,36,39
  order-item.entity.ts          |   71.42 |      100 |       0 |   76.47 | 22,27,32,35
  order.entity.ts               |   66.66 |      100 |       0 |   73.68 | 26,31,36,39,42
  product.entity.ts             |   71.42 |      100 |   14.28 |   76.47 | 19,24,29,32
  user.entity.ts                |   68.42 |      100 |       0 |   73.33 | 16,21,26,29
 src/migrations                 |       0 |      100 |       0 |       0 |
  1659825406414-migrations.ts   |       0 |      100 |       0 |       0 | 3-31
  1659826861827-migrations.ts   |       0 |      100 |       0 |       0 | 3-7
 src/order                      |       0 |      100 |     100 |       0 |
  order.module.ts               |       0 |      100 |     100 |       0 | 1-13
 src/order/aggregates           |     100 |      100 |     100 |     100 |
  order-aggregate.ts            |     100 |      100 |     100 |     100 |
 src/order/applications         |   91.66 |      100 |     100 |    90.9 |
  order.controller.ts           |   91.66 |      100 |     100 |    90.9 | 25,47
 src/order/errors               |     100 |      100 |     100 |     100 |
  invalid-order-error.ts        |     100 |      100 |     100 |     100 |
 src/order/services             |     100 |      100 |     100 |     100 |
  order.service.ts              |     100 |      100 |     100 |     100 |
 src/product                    |       0 |      100 |     100 |       0 |
  product.module.ts             |       0 |      100 |     100 |       0 | 1-12
 src/product/applications       |    91.3 |      100 |     100 |   90.47 |
  product.controller.ts         |    91.3 |      100 |     100 |   90.47 | 32,54
 src/product/dtos               |     100 |      100 |     100 |     100 |
  product-query-dto.ts          |     100 |      100 |     100 |     100 |
 src/product/errors             |     100 |      100 |     100 |     100 |
  product-not-found-error.ts    |     100 |      100 |     100 |     100 |
 src/product/services           |     100 |      100 |     100 |     100 |
  product.service.ts            |     100 |      100 |     100 |     100 |
 src/user                       |       0 |      100 |     100 |       0 |
  user.module.ts                |       0 |      100 |     100 |       0 | 1-13
 src/user/applications          |     100 |      100 |     100 |     100 |
  user.controller.ts            |     100 |      100 |     100 |     100 |
--------------------------------|---------|----------|---------|---------|-------------------

