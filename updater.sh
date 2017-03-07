#!/bin/bash

git fetch origin
#behind=$(git status | grep behind)
#reslog=$(git log HEAD..origin/master --oneline)
if (git status | grep behind -q); then
  /etc/init.d/lamp stop  
  git merge origin/master # completing the pull
  /etc/init.d/lamp start
fi
