#!/bin/sh

echo "Starting build"

npm ci --omit=dev

cd client
npm ci --include=dev
npm run build
rm -rf node_modules/
cd ../

echo "Build complete"