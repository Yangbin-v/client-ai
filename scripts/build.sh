#!/usr/bin/env bash

set -e

export PATH=:$PATH

echo "node $(node -v)"
echo "npm $(npm -v)"

rm -rf dist output

NODE_ENV=development npm install
NODE_ENV=production npm run build

mkdir output

cd dist

tar czf ../output/bundle.tar.gz ./

cd ..

echo "build success"
