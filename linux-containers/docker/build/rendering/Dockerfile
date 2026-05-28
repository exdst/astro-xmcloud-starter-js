# syntax=docker/dockerfile:1
# Multi-stage build for the Content SDK Next.js head app.
ARG PARENT_IMAGE=node:24-alpine

# ---- deps stage: install once, cache by package*.json ----
FROM ${PARENT_IMAGE} AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ---- dev stage: bind-mounted source from host ----
FROM ${PARENT_IMAGE} AS dev
WORKDIR /app
ENV NODE_ENV=development
ENV NEXTJS_DIST_DIR=.next-container
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ---- prod stage: build then serve ----
FROM ${PARENT_IMAGE} AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]