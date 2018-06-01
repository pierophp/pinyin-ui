#!/bin/bash

DIR="/home/node/pinyin/api/node_mdules"

cd api
if [ -d "$DIR" ]; then
    yarn dev
else
    yarn install
    chown -R node: $DIR
    yarn dev
fi
