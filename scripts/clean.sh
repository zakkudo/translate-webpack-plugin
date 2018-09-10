#!/bin/bash

set -e

CURRENT_DIR=$(pwd)
PROJECT_DIR=$(git rev-parse --show-toplevel)

cd $PROJECT_DIR

rm -rf build
rm -rf coverage
rm -rf documentation
rm -f jsdoc.*.conf.tmp
rm -f yarn-error.log
