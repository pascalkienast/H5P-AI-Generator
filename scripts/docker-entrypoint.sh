#!/bin/sh

# Function to check if an environment variable is set
check_env_var() {
  eval val=\$$1
  if [ -z "$val" ]; then
    echo "Error: Environment variable $1 is not set. This is required for the application to function correctly."
    return 1
  fi
  return 0
}

# Check all required environment variables
ENV_CHECK_FAILED=0

echo "Checking required environment variables..."

# Check essential API keys
for VAR in ANTHROPIC_API_KEY AI_API_KEY AI_API_ENDPOINT H5P_API_KEY H5P_API_ENDPOINT; do
  if ! check_env_var $VAR; then
    ENV_CHECK_FAILED=1
  else
    echo "$VAR is set"
  fi
done

if [ $ENV_CHECK_FAILED -eq 1 ]; then
  echo "One or more required environment variables are missing."
  echo "The application may not function correctly without them."
  echo "These should be configured in the Cloudron app configuration."
  
  # We don't exit with error as Cloudron will handle this
  # The manifest defines these as required, so they should be set
fi

# Print app information
echo "Starting H5P AI Generator..."
echo "App version: 1.0.0"
echo "Node.js version: $(node -v)"
echo "Environment: $NODE_ENV"

# Execute the provided command (typically node server.js)
exec "$@" 