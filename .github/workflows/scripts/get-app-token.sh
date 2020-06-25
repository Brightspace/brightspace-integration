#!/bin/bash

TOKEN_URL="$(curl -s \
	-H "Authorization: Bearer "$BSI_SYNC_JWT"" \
	-H "Accept: application/vnd.github.machine-man-preview+json" \
	https://api.github.com/repos/Brightspace/lms/installation \
	| jq -r .access_tokens_url)"

TOKEN="$(curl -X POST \
	-H "Authorization: Bearer "$BSI_SYNC_JWT"" \
	-H "Accept: application/vnd.github.machine-man-preview+json" \
	"$TOKEN_URL" \
	| jq -r .token)"

echo "::set-output name=token::$TOKEN"
