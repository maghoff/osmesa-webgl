#!/bin/bash -e

./build-osmesa.sh

node-gyp rebuild
