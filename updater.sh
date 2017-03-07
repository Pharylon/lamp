#!/bin/bash

git fetch origin
#behind=$(git status | grep behind)
#reslog=$(git log HEAD..origin/master --oneline)
if (git status | grep behind -q); then
  git merge origin/master # completing the pull
  pkill -f node
  node main.js
else
  #node main.js
fi
