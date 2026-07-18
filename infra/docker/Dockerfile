FROM node:24-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@10.28.1 --activate
WORKDIR /workspace

FROM base AS dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json .npmrc ./
COPY apps/admin/package.json apps/admin/package.json
COPY apps/api/package.json apps/api/package.json
COPY apps/sites/package.json apps/sites/package.json
COPY packages/blocks/package.json packages/blocks/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/database/package.json packages/database/package.json
COPY packages/database/prisma/schema.prisma packages/database/prisma/schema.prisma
COPY packages/design-system/package.json packages/design-system/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/tsconfig/package.json packages/tsconfig/package.json
COPY packages/utils/package.json packages/utils/package.json
RUN pnpm install --frozen-lockfile
RUN pnpm db:generate

FROM dependencies AS development
COPY . .
CMD ["pnpm", "dev"]

FROM dependencies AS validation
COPY . .
CMD ["pnpm", "run", "ci"]

FROM dependencies AS builder
ARG APP
COPY . .
RUN pnpm --filter "@blocosite/${APP}" build

FROM base AS runner
ARG APP
ENV APP=$APP
ENV NODE_ENV=production
COPY --from=builder /workspace /workspace
CMD ["sh", "-c", "pnpm --filter @blocosite/${APP} start"]
