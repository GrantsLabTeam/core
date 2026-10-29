Gitcoin Core Design System - portfolio exports

Two ways to show the design system. Neither needs a launcher, a server or an
internet connection.

1. Gitcoin-Design-System.pdf
   One PDF, 18 pages: Cover, Foundations, Components, Patterns & Screens.
   Each page is a full-width "frame" (like a Figma artboard), with sharp
   text you can zoom into. Open the sidebar / bookmarks to jump between pages.

2. website/
   A static website of the same 18 pages.
   - To view it: double-click website/index.html. Works offline, on Mac,
     Windows and Linux.
   - To put it online: upload the whole "website" folder as-is to
     Netlify Drop (app.netlify.com/drop), Vercel, GitHub Pages or any web host.
   - To use it in a portfolio site: host it (above), then link to it or embed
     a page with an iframe, e.g.
       <iframe src="https://YOUR-SITE/foundations-color.html"
               width="100%" height="900" style="border:0"></iframe>
   Pages are designed at 1600 px wide. Keep the "assets" folder next to the
   .html files.

Pages
  index.html                                  Cover
  foundations-color.html                      Color
  foundations-typography.html                 Typography
  foundations-shape-and-elevation.html        Shape & Elevation
  foundations-iconography.html                Iconography
  foundations-brand.html                      Brand
  components-*.html                           Badges, Buttons, Data Display,
                                              Feedback, Form Controls, Navigation
  patterns-and-screens-*.html                 Checker, Data Visualization,
                                              Forms & Flows, Pools & Programs,
                                              Projects & Applications, Retrofunding

These are static snapshots: everything looks like the live components but
nothing is clickable (dropdowns, tabs and modals are shown in fixed states).
