#!/bin/bash
# pm2 setup
# https://stackoverflow.com/questions/32178443/how-to-run-pm2-so-other-server-users-are-able-to-access-the-process
NODE_ENV=production
export NODE_ENV
rm -rf dist
npm run build

# FE
mkdir -p dist/fe
cp -r packages/fe-fast-and-dirty/dist/* dist/fe/
ssh "$SSH_CONNECTION_STRING" "rm -rf /var/schools/fe"
scp -r dist/fe "$SSH_CONNECTION_STRING":/var/schools/
scp -r tools/generate-user.mjs "$SSH_CONNECTION_STRING":/var/schools/tools/

# API
mkdir -p dist/api/packages/api-fast-and-dirty
mkdir -p dist/api/packages/common
cp package.json dist/api/package.json
cp package-lock.json dist/api/package-lock.json
cp packages/api-fast-and-dirty/package.json dist/api/packages/api-fast-and-dirty/package.json
cp packages/common/package.json dist/api/packages/common/package.json
cp -r packages/api-fast-and-dirty/dist dist/api/packages/api-fast-and-dirty/
cp -r packages/common/dist dist/api/packages/common/
ssh "$SSH_CONNECTION_STRING" "pm2 stop api"
ssh "$SSH_CONNECTION_STRING" "rm -rf /var/schools/api"
scp -r dist/api "$SSH_CONNECTION_STRING":/var/schools/
ssh "$SSH_CONNECTION_STRING" "cd /var/schools/api; npm ci --omit=dev; cp /var/schools/.env.production /var/schools/api/packages/api-fast-and-dirty/; pm2 start api"

# Export
mkdir -p dist/schools-export/packages/all-schools-builder
mkdir -p dist/schools-export/packages/common
cp package.json dist/schools-export/package.json
cp package-lock.json dist/schools-export/package-lock.json
cp packages/all-schools-builder/package.json dist/schools-export/packages/all-schools-builder/package.json
cp packages/common/package.json dist/schools-export/packages/common/package.json
cp -r packages/all-schools-builder/dist dist/schools-export/packages/all-schools-builder/
cp -r packages/common/dist dist/schools-export/packages/common/
ssh "$SSH_CONNECTION_STRING" "rm -rf /var/schools/schools-export"
scp -r dist/schools-export "$SSH_CONNECTION_STRING":/var/schools/
ssh "$SSH_CONNECTION_STRING" "cd /var/schools/schools-export; npm ci --omit=dev; cp /var/schools/.env.production /var/schools/schools-export/packages/all-schools-builder/"
