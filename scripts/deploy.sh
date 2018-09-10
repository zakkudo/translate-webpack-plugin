#!/bin/bash

set -e

CURRENT_DIR=$(pwd)
PROJECT_DIR=$(git rev-parse --show-toplevel)

cd $PROJECT_DIR

./scripts/cover.sh
./scripts/document.sh
./scripts/build.sh

yarn version

./scripts/build.sh

yarn publish --access public --cwd build --no-git-tag-version
