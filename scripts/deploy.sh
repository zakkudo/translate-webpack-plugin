#!/bin/bash

set -e

yarn build
yarn document
yarn cover Nothing to test yet!

cp README.md build/README.md
cp package.json build/package.json

yarn publish --access public --cwd build --no-git-tag-version
