# TapIn: RFID Attendance Website Simulation

TapIn is a static, browser-only demonstration of the classroom attendance workflow described in the Group 5 project proposal. It simulates RFID UID entry, student validation, session-based duplicate prevention, local timestamped attendance, student/session management, dashboards, reports, and CSV export.

The proposal describes a small classroom prototype. Progress Report No. 2 reports the RC522 reader, red/green LEDs, SQLite schema, and terminal feedback; it also says the LCD and buzzer were removed from scope. This website is a simulation only. It does not connect to Raspberry Pi hardware, an RFID reader, or a central server.

## Data and access

The website is public when deployed, but each visitor's demo data is saved only in that visitor's browser using `localStorage`. Data is not private, centrally stored, or shared between visitors. Clearing the browser's site data removes it. Do not enter real student personal information.

The initial browser visit seeds clearly fictional sample students and one active sample session. Later visits preserve the visitor's changes.

## Run locally

No dependencies or install step are required. From this folder:

```sh
npm run build
```

To preview, open `dist/index.html` in a browser, or serve the project using any static file server. Visitors to the deployed site do not need Node.js.

## Build

Requires Node.js 18 or newer for the `node:` filesystem APIs used by the copy-only build script:

```sh
npm run build
```

The output is `dist/`. The build script copies the HTML, CSS, and JavaScript without a bundler or framework. Relative asset paths allow the site to work at a GitHub Pages repository subpath.

## Publish to GitHub

1. Create an empty public repository on GitHub, for example `tapin-attendance-demo`.
2. In a terminal opened in this project folder, run:

```sh
git init
git add .
git commit -m "Build TapIn attendance simulation"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/tapin-attendance-demo.git
git push -u origin main
```

Replace `YOUR-USERNAME` and the repository name with your actual values. If this folder is already a Git repository, keep its existing history and add the remote only if needed.

## Deploy publicly with GitHub Pages

1. On GitHub, open the repository and go to **Settings → Pages**.
2. Under **Build and deployment**, choose **GitHub Actions**.
3. Add the workflow below at `.github/workflows/pages.yml`, commit it, and push to `main`.
4. In **Settings → Pages**, wait for the deployment to complete. GitHub shows the public URL there. For a project repository it usually follows `https://YOUR-USERNAME.github.io/tapin-attendance-demo/`.
5. Open that URL on a phone or a different computer to confirm the site loads. Try a sample card, then refresh: browser-local records should persist on that device. Another visitor will have a separate dataset.
6. Push later changes to `main`; GitHub Actions automatically rebuilds and redeploys the site.

Workflow file:

```yaml
name: Deploy TapIn to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

The included `.nojekyll` marker is copied into `dist` so GitHub Pages serves the static output as-is. No production code hardcodes a localhost URL. The live site is published at [https://alainacastillo.github.io/tapin-attendance-demo/](https://alainacastillo.github.io/tapin-attendance-demo/) after the first successful Pages deployment.

## Included functionality

- Overview dashboard and recent scan activity
- Website-only RFID simulation using sample cards or a manually entered UID
- Active student lookup, unknown/inactive-card rejection, and duplicate detection per active session
- Student add, edit, deactivate/reactivate, delete with confirmation, search, and attendance history
- Session creation, activation/closure, optional configurable cutoff and late marking
- Attendance search and date/session/status filters, plus CSV export
- Reports based on saved data, with summary, session/student tables, and filtered CSV export
- Confirmed demo reset and sample data loading
- Responsive navigation, accessible form labels, focus states, status text, and dialog controls

## Verification checklist after deployment

- Open the GitHub Pages URL from a separate device.
- Scan `A3 7F 91 2C`: the first tap should be accepted; the next tap in the same session should be detected as a duplicate.
- Enter an unknown UID and verify rejection with no attendance record.
- Add a student and confirm duplicate student IDs and RFID UIDs are rejected.
- Close the active session and confirm scans are rejected; create a new session and verify a new attendance record can be added.
- Filter attendance and export CSV.
- Refresh and confirm local data remains in that browser.
- Use a mobile viewport to check the navigation and tables.

All local state is demonstration data. The app intentionally provides no login, central database, user synchronization, or hardware integration.
