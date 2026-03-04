# ---- Base ----
FROM oven/bun:1 AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# ---- Development Dependencies (for testing in CI) ----
FROM base AS dev-dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ---- Production ----
FROM base AS production

ENV NODE_ENV=production

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["bun", "run", "src/main.ts"]
