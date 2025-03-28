FROM node:18-alpine AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm install

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create public directory if it doesn't exist
RUN mkdir -p public

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Add error checking for the build process
RUN npm install && npm run build || (echo "Build failed. Check the logs above for more information." && exit 1)

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Install required utilities
RUN apk add --no-cache wget curl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public directory and content-type-structures directory
COPY --from=builder /app/public ./public
COPY --from=builder /app/content-typ-structures ./content-typ-structures

# Set the correct permission for prerender cache
RUN mkdir -p .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# Add health check for Cloudron
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Startup script to check required environment variables (provided by Cloudron)
COPY --from=builder --chown=nextjs:nodejs /app/scripts/docker-entrypoint.sh ./
RUN chmod +x ./docker-entrypoint.sh

# server.js is created by next build from the standalone output
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"] 