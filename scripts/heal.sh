#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$PROJECT_DIR/data/agent-logs"
PROMPT_FILE="$PROJECT_DIR/.claude/prompts/heal.md"
TIMESTAMP=$(date +%s)
LOG_FILE="$LOG_DIR/heal-$TIMESTAMP.log"

mkdir -p "$LOG_DIR"

echo "=== Self-Healing Agent ===" | tee "$LOG_FILE"
echo "Started: $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOG_FILE"
echo "Error context: ${HEAL_ERROR_CONTEXT:-'(check cache files)'}" | tee -a "$LOG_FILE"
echo "===" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

claude \
  --dangerously-skip-permissions \
  --print \
  -p "$(cat "$PROMPT_FILE")" \
  2>&1 | tee -a "$LOG_FILE"

EXIT_CODE=${PIPESTATUS[0]}
echo "" | tee -a "$LOG_FILE"
echo "=== Agent exited with code $EXIT_CODE at $(date -u +%Y-%m-%dT%H:%M:%SZ) ===" | tee -a "$LOG_FILE"
exit $EXIT_CODE
