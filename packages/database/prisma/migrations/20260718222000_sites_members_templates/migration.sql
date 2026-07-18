CREATE TYPE "SiteStatus" AS ENUM ('DRAFT', 'ACTIVE', 'SUSPENDED', 'ARCHIVED');
CREATE TYPE "SiteRole" AS ENUM ('OWNER', 'EDITOR');
CREATE TYPE "PageStatus" AS ENUM ('ACTIVE', 'ARCHIVED');
CREATE TYPE "DomainType" AS ENUM ('SUBDOMAIN', 'CUSTOM');
CREATE TYPE "DomainStatus" AS ENUM ('PENDING', 'VERIFYING', 'VERIFIED', 'ACTIVE', 'FAILED', 'DISABLED');

CREATE TABLE "sites" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "ownerId" UUID NOT NULL, "internalName" VARCHAR(120) NOT NULL,
  "publicName" VARCHAR(160) NOT NULL, "segment" VARCHAR(80), "locale" VARCHAR(10) NOT NULL DEFAULT 'pt-BR',
  "timezone" VARCHAR(80) NOT NULL DEFAULT 'America/Fortaleza', "status" "SiteStatus" NOT NULL DEFAULT 'DRAFT',
  "subdomain" CITEXT NOT NULL, "templateKey" VARCHAR(80) NOT NULL, "draftRevision" INTEGER NOT NULL DEFAULT 1,
  "draftPublicSettings" JSONB NOT NULL DEFAULT '{"schemaVersion":1}', "privateSettings" JSONB NOT NULL DEFAULT '{"schemaVersion":1}',
  "draftNavigation" JSONB NOT NULL DEFAULT '{"schemaVersion":1,"items":[]}', "draftFooter" JSONB NOT NULL DEFAULT '{"schemaVersion":1}',
  "activeReleaseId" UUID, "noIndex" BOOLEAN NOT NULL DEFAULT true, "limitsOverride" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMPTZ NOT NULL, "deletedAt" TIMESTAMPTZ,
  CONSTRAINT "sites_pkey" PRIMARY KEY ("id"), CONSTRAINT "sites_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT
);
CREATE UNIQUE INDEX "sites_subdomain_key" ON "sites"("subdomain");
CREATE INDEX "sites_ownerId_idx" ON "sites"("ownerId"); CREATE INDEX "sites_status_idx" ON "sites"("status");

CREATE TABLE "site_members" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "siteId" UUID NOT NULL, "userId" UUID NOT NULL, "role" "SiteRole" NOT NULL,
  "invitedById" UUID, "acceptedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMPTZ NOT NULL,
  CONSTRAINT "site_members_pkey" PRIMARY KEY ("id"), CONSTRAINT "site_members_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE,
  CONSTRAINT "site_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  CONSTRAINT "site_members_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE SET NULL
);
CREATE UNIQUE INDEX "site_members_siteId_userId_key" ON "site_members"("siteId", "userId"); CREATE INDEX "site_members_userId_idx" ON "site_members"("userId");

CREATE TABLE "site_invitations" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "siteId" UUID NOT NULL, "email" CITEXT NOT NULL, "role" "SiteRole" NOT NULL DEFAULT 'EDITOR',
  "tokenHash" CHAR(64) NOT NULL, "invitedById" UUID NOT NULL, "expiresAt" TIMESTAMPTZ NOT NULL, "acceptedAt" TIMESTAMPTZ, "revokedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "site_invitations_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "site_invitations_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE,
  CONSTRAINT "site_invitations_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE RESTRICT,
  CONSTRAINT "site_invitations_editor_only" CHECK ("role" = 'EDITOR')
);
CREATE UNIQUE INDEX "site_invitations_tokenHash_key" ON "site_invitations"("tokenHash"); CREATE INDEX "site_invitations_siteId_idx" ON "site_invitations"("siteId"); CREATE INDEX "site_invitations_email_idx" ON "site_invitations"("email");

CREATE TABLE "domains" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "siteId" UUID NOT NULL, "hostname" CITEXT NOT NULL, "type" "DomainType" NOT NULL,
  "status" "DomainStatus" NOT NULL DEFAULT 'PENDING', "isPrimary" BOOLEAN NOT NULL DEFAULT false, "verificationTokenHash" CHAR(64),
  "verificationTokenCreatedAt" TIMESTAMPTZ, "lastCheckedAt" TIMESTAMPTZ, "verifiedAt" TIMESTAMPTZ, "activatedAt" TIMESTAMPTZ,
  "failureReasonCode" VARCHAR(80), "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMPTZ NOT NULL,
  CONSTRAINT "domains_pkey" PRIMARY KEY ("id"), CONSTRAINT "domains_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "domains_hostname_key" ON "domains"("hostname"); CREATE INDEX "domains_siteId_idx" ON "domains"("siteId");
CREATE UNIQUE INDEX "domains_one_primary" ON "domains"("siteId") WHERE "isPrimary" = true AND "status" = 'ACTIVE';

CREATE TABLE "pages" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "siteId" UUID NOT NULL, "title" VARCHAR(160) NOT NULL, "slug" CITEXT NOT NULL,
  "isHome" BOOLEAN NOT NULL DEFAULT false, "status" "PageStatus" NOT NULL DEFAULT 'ACTIVE', "sortOrder" INTEGER NOT NULL,
  "draftRevision" INTEGER NOT NULL DEFAULT 1, "draftContent" JSONB NOT NULL, "draftSeo" JSONB NOT NULL DEFAULT '{"schemaVersion":1}',
  "lastEditedById" UUID NOT NULL, "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMPTZ NOT NULL, "deletedAt" TIMESTAMPTZ,
  CONSTRAINT "pages_pkey" PRIMARY KEY ("id"), CONSTRAINT "pages_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE,
  CONSTRAINT "pages_lastEditedById_fkey" FOREIGN KEY ("lastEditedById") REFERENCES "users"("id") ON DELETE RESTRICT
);
CREATE INDEX "pages_siteId_idx" ON "pages"("siteId"); CREATE INDEX "pages_lastEditedById_idx" ON "pages"("lastEditedById");
CREATE UNIQUE INDEX "pages_site_slug_active_key" ON "pages"("siteId", "slug") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "pages_one_home_key" ON "pages"("siteId") WHERE "isHome" = true AND "deletedAt" IS NULL;
