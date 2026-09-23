#!/bin/sh
set -eu
cd "$(dirname "$0")"
rm -rf dist
mkdir -p dist/assets
cp index.html script.js style.css dist/
cp assets/* dist/assets/
