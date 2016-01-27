#!/bin/bash

set -e

if [ "$1" = 'node' ] || [ "$1" = 'npm' ]; then
  npm run db:ready
  npm run db:up
fi

# As argument is not related to node,
# then assume that user wants to run his own process,
# for example a `bash` shell to explore this image
exec "$@"
