# pushes github pages to the webhost

# git subtree push --prefix gh-pages origin gh-pages --force
git push origin `git subtree split --prefix gh-pages master`:gh-pages --force