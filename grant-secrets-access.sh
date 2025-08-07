#!/bin/bash

# Grant Firebase App Hosting backend access to all secrets
# This script grants the astro-library backend access to all created secrets

echo "Granting App Hosting backend access to all secrets..."

# List of all secrets that need access
secrets=(
    "firebase-api-key"
    "firebase-auth-domain"
    "firebase-project-id"
    "firebase-storage-bucket"
    "firebase-messaging-sender-id"
    "firebase-app-id"
    "firebase-measurement-id"
    "firebase-client-email"
    "firebase-private-key"
    "nextauth-url"
    "nextauth-secret"
    "google-client-id"
    "google-client-secret"
)

# Grant access to each secret
for secret in "${secrets[@]}"; do
    echo "Granting access to $secret..."
    firebase apphosting:secrets:grantaccess "$secret" --backend astro-library
    if [ $? -eq 0 ]; then
        echo "✅ Successfully granted access to $secret"
    else
        echo "❌ Failed to grant access to $secret"
    fi
done

echo "Finished granting access to all secrets!"
