# Shorts Guard

**Shorts Guard** is a lightweight Chrome extension that helps you control YouTube Shorts consumption using a **daily limit**. It tracks Shorts watched, shows a small in-video **HUD** with your progress, auto-advances while you’re under the limit, and **blocks Shorts** once you hit your cap.

- **Extension type**: Chrome Extension (Manifest V3)
- **Version**: `1.0.1`
- **Build step**: none (plain HTML/CSS/JavaScript)

## Features

- **Daily limit**: set how many Shorts you want to watch today.
- **Auto counting**: increments after a Short is watched for ~5 seconds.
- **In-video HUD**: always-visible progress indicator (`count/limit`).
- **Auto-advance**: attempts to move to the next Short while under the limit.
- **Block screen**: redirects to a “limit reached” page when you hit the cap.
- **Daily reset**: count resets automatically at midnight (via alarms).

## Install (Load Unpacked)

1. Download/clone this repo.
2. Open Chrome → `chrome://extensions/`.
3. Turn on **Developer mode** (top-right).
4. Click **Load unpacked**.
5. Select the project folder (`shorts guard`).
6. (Optional) Pin **Shorts Guard** in the toolbar for quick access.

## Usage

1. Click the extension icon to open the popup.
2. Complete onboarding by setting your **daily Shorts limit**.
3. Visit a Shorts page like `youtube.com/shorts/...`.
4. Watch normally—after ~5 seconds per Short, Shorts Guard increments your count.
5. When you reach your limit, Shorts Guard redirects you to `blocked.html`.

## How it works (high level)

- A content script runs on `*://*.youtube.com/shorts/*` and:
  - detects when you’re on a new Short (URL + periodic checks),
  - starts a ~5s timer per Short, then increments your daily count,
  - updates an on-screen HUD,
  - auto-advances if you’re still under the limit,
  - redirects to `blocked.html` once your daily limit is reached.
- A background service worker stores state in `chrome.storage.local` and schedules a midnight reset using `chrome.alarms`.

## Permissions (why they’re needed)

- **`storage`**: store your limit, today’s count, and onboarding state.
- **`alarms`**: schedule the daily reset at midnight.
- **`tabs`**: supports tab-level extension behavior.
- **`scripting`**: supports extension script execution patterns (MV3).
- **Host permission `*://*.youtube.com/*`**: required to run on YouTube (Shorts pages specifically).

## Project structure

- `manifest.json`: extension configuration (Manifest V3)
- `background.js`: service worker (state, alarms, messaging)
- `content.js`: Shorts logic (watch detection, counting, HUD, auto-advance, redirect)
- `popup.html`, `popup.js`: popup UI + settings
- `blocked.html`, `blocked.js`: limit-reached screen
- `styles/`: popup/HUD/blocked styles
- `icons/`: extension icons

## Troubleshooting

- **HUD isn’t showing**: confirm you’re on `youtube.com/shorts/...` and the extension is enabled in `chrome://extensions/`.
- **Counting feels off**: counting happens after ~5 seconds on a Short; rapidly skipping may not increment.
- **Reset didn’t happen**: keep Chrome running overnight (alarms run in the background, but system/Chrome settings can affect timing).

## Privacy

Shorts Guard stores only local settings (limit, count, timestamps) in **Chrome local extension storage**. It does not include a backend and does not send data to external servers.

## Test checklist

- Set a limit from the popup onboarding
- Verify HUD appears on Shorts pages
- Confirm count increments after ~5 seconds on a Short
- Confirm auto-advance behavior under the limit
- Hit the limit and verify redirect to `blocked.html`
- Verify daily reset around midnight
