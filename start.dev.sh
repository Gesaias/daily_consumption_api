#!/bin/bash

docker compose up -d

npm i -g @nestjs/cli
npm i ts-node

npm i

npm run start dev
