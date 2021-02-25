#!/bin/bash

REF_ARR=(${GITHUB_TAG//\// })
BSI_VERSION=${REF_ARR[2]}

echo "Latest BSI tag: $BSI_VERSION"

# Get all "non-branch" commits reachable from master
MASTER_COMMITS=$(git rev-list --first-parent origin/master)

# Only use tags that are on one of those commits and
# have the right kind of name.
if [[ ! "$MASTER_COMMITS" =~ "${GITHUB_COMMIT_ID}" ]]
then
  echo "Tag is not reachable from master, we will skip this tag"
  exit 0
elif  [[ ! "$BSI_VERSION" =~ ^v20\.[0-9]+\.[0-9]+-[0-9]+$ ]]
then
  echo "The tag name isn't in the proper format for a release tag, we will skip this tag"
  exit 0
else
  echo "Tag looks good: right format and reachable from master"
fi

#AUTHOR_EMAIL=$(git show -s --format='%ae' $GITHUB_COMMIT_ID)

echo "::set-output name=bsi-version::${BSI_VERSION:1}"
