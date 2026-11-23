#!/usr/bin/env bash
cd "$(dirname "$0")"
command -v node >/dev/null || { echo 'Node.js 18+ is required.'; exit 1; }
if command -v xdg-open >/dev/null; then (sleep 1; xdg-open http://localhost:4178 >/dev/null 2>&1) & fi
node server.js
