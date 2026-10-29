Gitcoin Design System - Storybook (static build)

It opens on the "Design System" section: Figma-style pages for the cover,
foundations (color, typography, shape & elevation, iconography, brand),
components and product screens. The original developer stories are below it
in the sidebar.

Note: opening storybook/index.html directly does NOT work. Browsers block
Storybook when a page is opened straight from disk. Use a launcher below.


MAC
---
1. Unzip the file and open the "gitcoin-design-system-storybook" folder.
2. Double-click "Open Storybook (Mac).command".
   A Terminal window opens and your browser shows the Design System cover.
3. When you're done, close the Terminal window.

If macOS blocks it the first time ("Apple could not verify..." or
"cannot be opened because it is from an unidentified developer"):

  macOS 15 Sequoia and newer:
    a. Click "Done" on the warning.
    b. Open System Settings > Privacy & Security.
    c. Scroll down to the message about "Open Storybook (Mac).command"
       and click "Open Anyway". Confirm with your password.
    d. Double-click "Open Storybook (Mac).command" again and choose "Open".

  macOS 14 Sonoma and older:
    Right-click "Open Storybook (Mac).command" > Open > Open.

If it still doesn't work, use Terminal instead (always works):
  1. Open the Terminal app (Applications > Utilities > Terminal).
  2. Type  bash  followed by a space (don't press Enter yet).
  3. Drag "Open Storybook (Mac).command" from Finder into the Terminal window.
  4. Press Enter.

If you see "No way to start a local server was found", run this in
Terminal, accept the install, then try again:
  xcode-select --install


LINUX
-----
Option A: in a terminal, run   ./open-storybook-linux.sh
Option B: double-click "Open Storybook (Linux).desktop".
          On GNOME, right-click it first and choose "Allow Launching".
Your browser opens on the Design System cover. Press Ctrl+C or close the
terminal to stop.


HOSTING ONLINE
--------------
Upload the "storybook" folder as-is to Netlify Drop (app.netlify.com/drop),
Vercel or GitHub Pages. No build step is needed.
