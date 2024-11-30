#!/bin/bash
# pm2 setup
# https://stackoverflow.com/questions/32178443/how-to-run-pm2-so-other-server-users-are-able-to-access-the-process
NODE_ENV=production
export NODE_ENV
rm -rf dist
npm run build
mkdir -p dist/api/packages/api-fast-and-dirty
mkdir -p dist/api/packages/common
cp package.json dist/api/package.json
cp package-lock.json dist/api/package-lock.json
cp packages/api-fast-and-dirty/package.json dist/api/packages/api-fast-and-dirty/package.json
cp packages/common/package.json dist/api/packages/common/package.json
cp -r packages/api-fast-and-dirty/dist dist/api/packages/api-fast-and-dirty/
cp -r packages/common/dist dist/api/packages/common/
mkdir -p dist/fe
cp -r packages/fe-fast-and-dirty/dist/* dist/fe/
ssh "$SSH_CONNECTION_STRING" "pm2 stop 0"
ssh "$SSH_CONNECTION_STRING" "rm -rf /var/schools/api"
scp -r dist/api "$SSH_CONNECTION_STRING":/var/schools/
ssh "$SSH_CONNECTION_STRING" "cd /var/schools/api; npm -w packages/common ci --omit=dev; npm -w packages/api-fast-and-dirty ci --omit=dev; cp /var/schools/.env.production /var/schools/api/packages/api-fast-and-dirty/; pm2 start 0"
ssh "$SSH_CONNECTION_STRING" "rm -rf /var/schools/fe"
scp -r dist/fe "$SSH_CONNECTION_STRING":/var/schools/
scp -r tools/generate-user.mjs "$SSH_CONNECTION_STRING":/var/schools/tools/
