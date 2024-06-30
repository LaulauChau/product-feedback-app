ARG NODE_VERSION=20.15.0
ARG PNPM_VERSION=9.4.0

FROM --platform=linux/amd64 node:${NODE_VERSION}-alpine AS base

ENV NEXT_TELEMETRY_DISABLED 1
ENV PNPM_HOME="/pnpm"
ENV PNPM_VERSION=${PNPM_VERSION}
ENV PATH="$PNPM_HOME:$PATH"
ENV SKIP_ENV_VALIDATION=true

RUN corepack enable
RUN apk add --no-cache libc6-compat openssl

FROM base AS dependencies

WORKDIR /usr/src/app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/pnpm/store \
    pnpm install --frozen-lockfile

FROM base AS runner

WORKDIR /usr/src/app

COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .

CMD pnpm run dev