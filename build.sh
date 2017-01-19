#!/usr/bin/env bash

# Install babel:
# npm install --global babel-cli

babel src --out-dir lib --presets es2015
babel src --watch --out-dir gh-pages/lib  --presets es2015