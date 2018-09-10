#!/bin/bash

set -e

export NODE_ENV="document"

CURRENT_DIR=$(pwd)
PROJECT_DIR=$(git rev-parse --show-toplevel)
BIN_DIR=$(npm bin)
JSDOC="$BIN_DIR/jsdoc"
OPTIONS="--module-index-format none --global-index-format none --example-lang js --heading-depth 3"

cd $PROJECT_DIR

$JSDOC -c jsdoc.config.json "$@"
cat src/README.md > README.md

echo "" >> README.md
echo "## API" >> README.md
echo "" >> README.md

./node_modules/.bin/jsdoc2md src/index.js $OPTIONS >> README.md

./scripts/postProcessReadme.js README.md
