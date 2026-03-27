# Shorts Guard

Shorts Guard is a Chrome extension that helps you control YouTube Shorts usage with a daily limit, automatic short counting, and a block screen once your limit is reached.

## Features

- Set a daily Shorts limit during onboarding
- Track Shorts watched count for the current day
- Auto-increment count after a short is watched for 5 seconds
- Auto-scroll to the next short while under the limit
- Show an in-video HUD with live progress
- Block further Shorts access after limit is reached
- Automatically reset count at midnight

## Project Structure

- `manifest.json` - Extension configuration (Manifest V3)
- `background.js` - Service worker for state, alarms, and messaging
- `content.js` - YouTube Shorts page logic (watch detection, counting, auto-scroll, HUD)
- `popup.html` / `popup.js` - Extension popup UI and settings
- `blocked.html` / `blocked.js` - Limit-reached screen
- `styles/` - Popup, HUD, and blocked page styles
- `icons/` - Extension icons

## Installation (Load Unpacked)

1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** (top-right).
4. Click **Load unpacked**.
5. Select this project folder (`shorts guard`).
6. Pin the extension from the Chrome toolbar for easy access.

## How It Works

1. Open the extension popup and set your daily Shorts limit.
2. Visit YouTube Shorts (`youtube.com/shorts/...`).
3. Shorts Guard tracks watched shorts and updates the counter.
4. After each counted short, it attempts to move to the next short automatically.
5. When your count reaches the limit, you are redirected to the blocked page.
6. The count resets automatically at midnight.

## Permissions Used

- `storage` - Save daily limit, count, and reset state
- `alarms` - Schedule daily midnight reset
- `tabs` - Tab-level extension behavior support
- `scripting` - Script execution support for extension logic
- `*://*.youtube.com/*` host permission - Run on YouTube Shorts pages

## Development Notes

- Manifest version: `3`
- Current extension version: `1.0.1`
- No build step required (plain HTML/CSS/JavaScript)

## Testing Checklist

- Set a limit from popup onboarding
- Verify HUD appears on Shorts page
- Confirm count increases after 5 seconds on a short
- Confirm auto-scroll behavior between shorts
- Hit limit and verify redirect to `blocked.html`
- Verify daily reset behavior around midnight
