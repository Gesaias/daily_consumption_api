#!/bin/bash

# Run database
docker compose up -d

# Install dependencies
npm i -g @nestjs/cli
npm i ts-node
npm i

# Run project
npm run build && npm run seed
npm run start dev
