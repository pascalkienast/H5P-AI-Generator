# Deploying H5P AI Generator to Cloudron

This guide covers how to deploy the H5P AI Generator application to [Cloudron](https://cloudron.io/), a platform for self-hosting web applications.

## Prerequisites

1. A Cloudron server set up and running
2. Cloudron CLI installed on your development machine
   ```bash
   sudo npm install -g cloudron
   ```
3. Docker installed on your development machine

## Deployment Steps

### 1. Login to your Cloudron

```bash
cloudron login my.example.com
```

Replace `my.example.com` with your actual Cloudron domain.

### 2. Build the Docker Image

From the root directory of this project, build the Docker image:

```bash
cloudron build
```

When prompted, enter a repository name (e.g., `yourusername/h5p-ai-generator`).

This command will:
- Build the Docker image with a timestamp-based tag
- Push the image to the specified repository

### 3. Install the App on Cloudron

```bash
cloudron install
```

This will install the application on your Cloudron server. The CLI will prompt you for:
- The app's subdomain
- Configuration values for required environment variables

### 4. Configure Required Environment Variables

The application requires the following environment variables, which you can set during installation or in the Cloudron admin interface:

- `ANTHROPIC_API_KEY`: Your Anthropic API key for accessing Claude AI
- `AI_API_KEY`: Your Academic Cloud API key for accessing AI models
- `AI_API_ENDPOINT`: The base URL for the Academic Cloud API
- `H5P_API_KEY`: API key for authenticating with the H5P REST API server
- `H5P_API_ENDPOINT`: The base URL of your H5P REST API server

### 5. Updating the App

To update the application after making changes:

1. Build a new Docker image:
   ```bash
   cloudron build
   ```

2. Update the app:
   ```bash
   cloudron update
   ```

## Troubleshooting

- Check the application logs in the Cloudron admin interface
- Ensure all required environment variables are correctly set
- Verify your H5P REST API server is accessible from the Cloudron server

## Additional Resources

- [Cloudron Documentation](https://docs.cloudron.io/)
- [Cloudron CLI Documentation](https://docs.cloudron.io/packaging/cli/)
- [Cloudron Manifest Documentation](https://docs.cloudron.io/packaging/manifest/) 