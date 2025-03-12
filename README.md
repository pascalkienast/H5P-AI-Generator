# H5P AI Generator

A Next.js application that leverages Claude AI to generate interactive H5P content. This application allows users to describe the educational content they want to create and guides them through a conversational process to generate customized H5P modules.

## Features

- Conversational AI interface for content creation
- Support for multiple H5P content types:
  - Multiple Choice
  - True/False
  - Fill in the Blanks
  - Interactive Video
  - Branching Scenario (for complex interactive content)
- Instant preview of generated H5P modules
- Easy download of the final H5P file

## Getting Started

### Prerequisites

- Node.js 14.x or later
- An H5P REST API server running (see [H5P REST API](https://github.com/pascalkienast/H5P-REST-API))
- An Anthropic API key for Claude

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/h5p-ai-generator.git
   cd h5p-ai-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   ANTHROPIC_API_KEY=your_anthropic_api_key
   H5P_API_KEY=your_h5p_api_key
   H5P_API_ENDPOINT=http://localhost:8080
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. On the start page, enter a description of the H5P content you want to create (e.g., "Create a quiz about European capitals")
2. Engage in a short conversation with the AI to refine your content requirements
3. Once enough information is gathered, the AI will generate the H5P module
4. Preview the generated module and download the H5P file

## Environment Variables

- `ANTHROPIC_API_KEY`: Your Anthropic API key for accessing Claude AI
- `H5P_API_KEY`: API key for authenticating with the H5P REST API server
- `H5P_API_ENDPOINT`: The base URL of your H5P REST API server

## Deployment

### Deploying to Vercel (Recommended)

The easiest way to deploy your Next.js app is to use [Vercel](https://vercel.com), the platform built by the creators of Next.js.

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the project in Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

```bash
npm install -g vercel
vercel
```

### Self-Hosting with Node.js

You can deploy the application on your own server using Node.js:

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

3. For production deployment, consider using a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start npm --name "h5p-ai-generator" -- start
   ```

### Deploying with Docker

You can also run the application in a Docker container using our production-ready Dockerfile:

1. Create a Dockerfile in the root directory:
   ```dockerfile
   FROM node:18-alpine AS deps
   WORKDIR /app
   
   # Install dependencies based on the preferred package manager
   COPY package.json package-lock.json* ./
   RUN npm ci
   
   # Rebuild the source code only when needed
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   
   # Create public directory if it doesn't exist
   RUN mkdir -p public
   
   # Next.js collects completely anonymous telemetry data about general usage.
   ENV NEXT_TELEMETRY_DISABLED 1
   
   RUN npm run build
   
   # Production image, copy all the files and run next
   FROM node:18-alpine AS runner
   WORKDIR /app
   
   ENV NODE_ENV production
   ENV NEXT_TELEMETRY_DISABLED 1
   
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   
   COPY --from=builder /app/public ./public
   
   # Set the correct permission for prerender cache
   RUN mkdir .next
   RUN chown nextjs:nodejs .next
   
   # Automatically leverage output traces to reduce image size
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
   
   USER nextjs
   
   EXPOSE 3000
   
   ENV PORT 3000
   ENV HOSTNAME "0.0.0.0"
   
   CMD ["node", "server.js"]
   ```

2. Update your `next.config.js` to support standalone output:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     reactStrictMode: true,
     output: 'standalone',
     async rewrites() {
       // Only apply rewrites if the H5P_API_ENDPOINT is defined
       if (process.env.H5P_API_ENDPOINT) {
         return [
           // Proxy requests to the H5P API to avoid CORS issues
           {
             source: '/h5p-api/:path*',
             destination: `${process.env.H5P_API_ENDPOINT}/:path*`,
           },
         ];
       }
       // Return empty array if H5P_API_ENDPOINT is not defined
       return [];
     },
   };
   
   module.exports = nextConfig;
   ```

3. Create a `.dockerignore` file to optimize build performance:
   ```
   # Dependencies
   node_modules
   npm-debug.log
   yarn-debug.log
   yarn-error.log
   
   # Next.js
   .next
   out
   
   # Misc
   .git
   .github
   .vscode
   *.md
   !README.md
   
   # Environment variables
   .env
   .env.local
   .env.development.local
   .env.test.local
   .env.production.local
   ```

4. Build and run the Docker container locally:
   ```bash
   docker build -t h5p-ai-generator .
   docker run -p 3000:3000 --env-file .env.local h5p-ai-generator
   ```

### Deploying with Coolify

[Coolify](https://coolify.io/) is an open-source, self-hostable Heroku / Netlify alternative that works perfectly with this application:

1. Push your code to a Git repository (GitHub, GitLab, or Gitea)
2. In your Coolify dashboard, create a new service
3. Select "Application" and then choose your repository
4. Select Docker as the deployment method
5. Configure the following environment variables:
   - `ANTHROPIC_API_KEY`: Your Anthropic API key
   - `H5P_API_ENDPOINT`: Your H5P API endpoint (must include http/https prefix)
   - `H5P_API_KEY`: Your H5P API key (if required)
6. Click on "Deploy" to start the deployment process

Coolify will use the Dockerfile in your repository to build and deploy the application.

**Troubleshooting Coolify Deployments:**

- If you encounter deployment errors related to the public directory, ensure your Dockerfile includes `RUN mkdir -p public` in the builder stage
- Make sure your `next.config.js` handles missing environment variables to avoid "undefined" errors during build
- For security, run the container as a non-root user as shown in the Dockerfile above

### Important Production Considerations

1. Ensure your H5P API server is properly secured and has adequate resources
2. Set appropriate rate limits for the Anthropic API to control costs
3. Configure CORS headers if your front-end and API are on different domains
4. Set up proper monitoring and logging for production environments
5. Consider using a secure secret management system rather than plain environment variables

## Technologies Used

- Next.js - React framework
- Tailwind CSS - Utility-first CSS framework
- Anthropic API - Claude AI model
- H5P REST API - For creating and managing H5P content

## Project Structure

```
/
├── components/       # React components
├── pages/            # Next.js pages and API routes
├── styles/           # Global styles
├── utils/            # Utility functions
└── public/           # Static assets
```

## License

MIT

## Acknowledgments

- H5P for providing the open-source framework for interactive content
- Anthropic for the Claude AI model 