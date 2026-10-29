#!/bin/bash
# Double-click to view the Gitcoin Design System Storybook.
# Starts a small local web server (Storybook can't run from file://) and opens the browser.
# Close this Terminal window to stop it.

cd "$(dirname "$0")/storybook" || exit 1

PORT=6006
while lsof -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; do PORT=$((PORT + 1)); done
URL="http://localhost:$PORT/?path=/story/design-system-cover--cover&panel=false"

if xcode-select -p >/dev/null 2>&1 && command -v python3 >/dev/null 2>&1; then
  SERVER=(python3 -m http.server "$PORT" --bind 127.0.0.1)
elif command -v perl >/dev/null 2>&1; then
  SERVER=(perl ../serve.pl . "$PORT")
elif command -v ruby >/dev/null 2>&1; then
  SERVER=(ruby -run -e httpd . -p "$PORT" -b 127.0.0.1)
elif command -v npx >/dev/null 2>&1; then
  SERVER=(npx -y http-server -p "$PORT" -a 127.0.0.1 -c-1 -s)
else
  echo "No way to start a local server was found."
  echo "Install the Xcode Command Line Tools by running:  xcode-select --install"
  read -r -p "Press Enter to close."
  exit 1
fi

echo "Gitcoin Design System Storybook -> $URL"
echo "Keep this window open while browsing. Close it to stop."
(sleep 1.5; open "$URL") &
exec "${SERVER[@]}"
