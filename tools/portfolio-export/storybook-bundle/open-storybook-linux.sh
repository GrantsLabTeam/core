#!/usr/bin/env bash
# Linux launcher for the Gitcoin Design System Storybook.
# Starts a small local web server (Storybook can't run from file://) and opens the browser.
# Press Ctrl+C (or close the terminal) to stop it.

cd "$(dirname "$(readlink -f "$0")")/storybook" || exit 1

port_in_use() {
  if command -v ss >/dev/null 2>&1; then
    ss -ltn "sport = :$1" | grep -q LISTEN
  else
    (exec 3<>"/dev/tcp/127.0.0.1/$1") 2>/dev/null
  fi
}

PORT=6006
while port_in_use "$PORT"; do PORT=$((PORT + 1)); done
URL="http://localhost:$PORT/?path=/story/design-system-cover--cover&panel=false"

if command -v python3 >/dev/null 2>&1; then
  SERVER=(python3 -m http.server "$PORT" --bind 127.0.0.1)
elif command -v perl >/dev/null 2>&1; then
  SERVER=(perl ../serve.pl . "$PORT")
elif command -v ruby >/dev/null 2>&1; then
  SERVER=(ruby -run -e httpd . -p "$PORT" -b 127.0.0.1)
elif command -v npx >/dev/null 2>&1; then
  SERVER=(npx -y http-server -p "$PORT" -a 127.0.0.1 -c-1 -s)
else
  echo "No way to start a local server was found. Install python3 or perl and try again."
  read -r -p "Press Enter to close."
  exit 1
fi

echo "Gitcoin Design System Storybook -> $URL"
echo "Keep this window open while browsing. Press Ctrl+C to stop."
(sleep 1.5; xdg-open "$URL" >/dev/null 2>&1 || echo "Open $URL in your browser.") &
exec "${SERVER[@]}"
