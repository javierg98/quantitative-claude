#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$PROJECT_DIR/data/agent-logs"
PROMPT_FILE="$PROJECT_DIR/.claude/prompts/improve.md"
TIMESTAMP=$(date +%s)
LOG_FILE="$LOG_DIR/improve-$TIMESTAMP.log"

mkdir -p "$LOG_DIR"

echo "=== Self-Improvement Agent ===" | tee "$LOG_FILE"
echo "Started: $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOG_FILE"
echo "Project: $PROJECT_DIR" | tee -a "$LOG_FILE"
echo "===" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

if [ ! -f "$PROMPT_FILE" ]; then
  echo "ERROR: Prompt file not found: $PROMPT_FILE" | tee -a "$LOG_FILE"
  exit 1
fi

claude \
  --dangerously-skip-permissions \
  --print \
  -p "$(cat "$PROMPT_FILE")" \
  2>&1 | tee -a "$LOG_FILE"

EXIT_CODE=${PIPESTATUS[0]}

echo "" | tee -a "$LOG_FILE"
echo "=== Agent exited with code $EXIT_CODE at $(date -u +%Y-%m-%dT%H:%M:%SZ) ===" | tee -a "$LOG_FILE"

exit $EXIT_CODE
