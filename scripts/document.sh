#!/bin/bash

set -e

PROJECT_DIR=$(git rev-parse --show-toplevel)
BIN_DIR=$(npm bin)
JSDOC="$BIN_DIR/jsdoc"

$JSDOC -c $PROJECT_DIR/jsdoc.config.json "$@"
./node_modules/.bin/jsdoc2md src/*.js > README.md
