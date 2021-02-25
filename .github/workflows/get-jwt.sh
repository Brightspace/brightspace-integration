#!/bin/bash

# Static header fields.
HEADER='{
	"type": "JWT",
	"alg": "RS256"
}'

payload='{
	"iss": "69373"
}'

PAYLOAD=$(
	echo "${payload}" | jq --arg time_str "$(date +%s)" \
	'
	($time_str | tonumber) as $time_num
	| .iat=$time_num
	| .exp=($time_num + 600)
	'
)

function b64enc() {
	openssl enc -base64 -A | tr '+/' '-_' | tr -d '=';
}

function rs_sign() {
	openssl dgst -binary -sha256 -sign <(echo -n "$BSI_SYNC_PEM");
}

JWT_HDR_B64="$(echo -n "$HEADER" | b64enc)"
JWT_PAY_B64="$(echo -n "$PAYLOAD" | b64enc)"
UNSIGNED_JWT="$JWT_HDR_B64.$JWT_PAY_B64"
SIGNATURE=$(echo -n "$UNSIGNED_JWT" | rs_sign | b64enc)

echo "::set-output name=jwt::$UNSIGNED_JWT.$SIGNATURE"
