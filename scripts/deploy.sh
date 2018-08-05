#!/bin/bash

set -e

yarn build
yarn document
#yarn cover Nothing to test yet!

yarn publish --access public
