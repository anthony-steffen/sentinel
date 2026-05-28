#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PS_SCRIPT_WIN="$(cygpath -w "$SCRIPT_DIR/start-public-demo.ps1")"

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$PS_SCRIPT_WIN" "$@"
