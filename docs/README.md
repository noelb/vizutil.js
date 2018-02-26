This directory contains the source for the demo site:
https://noelb.github.io/vizutil.js/

It uses Jekyll to generate static pages to serve through Github pages.

If you've never setup ruby and/or jekyll:
brew install ruby
gem install jekyll
bundle install




HOW TO RUN FOR LOCAL TESTING


OLD PUSH TO GH-PAGES
git push origin `git subtree split --prefix gh-pages master`:gh-pages --force


#!/usr/bin/env bash
# Run this for local testing
bundle exec jekyll serve


