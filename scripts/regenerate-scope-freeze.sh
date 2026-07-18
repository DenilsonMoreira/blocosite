#!/usr/bin/env sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$ROOT_DIR"

FILES="
AGENTS.md
PRODUCT_SPEC.md
ARCHITECTURE.md
DATA_MODEL.md
BLOCKS_SPEC.md
API_CONTRACT.md
UX_UI_SPEC.md
SECURITY.md
TESTING.md
DEPLOYMENT.md
ACCEPTANCE_CRITERIA.md
docs/TEMPLATES_SPEC.md
docs/PERMISSIONS_MATRIX.md
docs/SITE_STATES.md
docs/RELEASE_WORKFLOWS.md
docs/PRIVACY_OPERATIONS.md
docs/V2_NOTES.md
"

# shellcheck disable=SC2086
sha256sum $FILES > docs/scope-freeze.sha256
