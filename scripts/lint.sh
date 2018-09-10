#!/bin/bash

set -e

export NODE_ENV="lint"

CURRENT_DIR=$(pwd)
PROJECT_DIR=$(git rev-parse --show-toplevel)

cd $PROJECT_DIR

./node_modules/.bin/eslint src "$@"
