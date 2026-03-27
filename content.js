// Shorts Guard - Content Script

console.log('Shorts Guard: Content script starting...');

let shortId = null;
let counted = false;
let scrollTimer = null;

// Run immediately
function init() {
  console.log('Shorts Guard: init() called');

  // Get initial short ID
  shortId = getShortId();
  console.log('Shorts Guard: Initial short ID:', shortId);

  if (shortId) {
    startWatching();
  }

  // Watch for URL changes
  setInterval(checkForNewShort, 2000);

  // Also listen for navigation
  window.addEventListener('yt-navigate-finish', handleNavigation);
  window.addEventListener('popstate', handleNavigation);
}

function getShortId() {
  // Try multiple ways to get short ID
  const path = window.location.pathname;
  if (path.includes('/shorts/')) {
    const parts = path.split('/shorts/');
    if (parts[1]) return parts[1].split('/')[0];
  }

  // Try from video element
  const video = document.querySelector('video');
  if (video) {
    const src = video.src || '';
    const match = src.match(/videoid=([a-zA-Z0-9_-]+)/);
    if (match) return match[1];
  }

  return null;
}

function handleNavigation() {
  console.log('Shorts Guard: Navigation detected');
  setTimeout(checkForNewShort, 1500);
}

function checkForNewShort() {
  const newId = getShortId();
  console.log('Shorts Guard: Checking short -', newId);

  if (newId && newId !== shortId) {
    console.log('Shorts Guard: New short detected!');
    shortId = newId;
    counted = false;
    startWatching();
  }
}

function startWatching() {
  console.log('Shorts Guard: Starting to watch...');

  // Clear any existing timer
  if (scrollTimer) clearTimeout(scrollTimer);

  // Show HUD
  showHUD();

  // Start 5 second timer
  scrollTimer = setTimeout(() => {
    console.log('Shorts Guard: 5 seconds up!');
    onWatchComplete();
  }, 5000);
}

function onWatchComplete() {
  if (counted) return;

  // Increment count
  chrome.runtime.sendMessage({ action: 'incrementCount' }, (response) => {
    console.log('Shorts Guard: Increment response:', response);

    counted = true;
    updateHUD();

    if (response && response.count >= response.limit) {
      console.log('Shorts Guard: LIMIT REACHED!');
      setTimeout(redirectToBlocked, 500);
    } else {
      // Auto scroll to next
      scrollToNext();
    }
  });
}

function scrollToNext() {
  console.log('Shorts Guard: Scrolling to next...');

  // Method 1: Press arrow down
  document.dispatchEvent(new KeyboardEvent('keydown', {
    key: 'ArrowDown',
    keyCode: 40,
    which: 40,
    bubbles: true
  }));

  // Method 2: Scroll the page
  window.scrollBy({
    top: window.innerHeight * 0.9,
    behavior: 'smooth'
  });
}

function redirectToBlocked() {
  const id = chrome.runtime.id;
  window.location.href = `chrome-extension://${id}/blocked.html`;
}

// HUD
let hud = null;

function showHUD() {
  if (hud) return;

  hud = document.createElement('div');
  hud.id = 'shorts-guard-hud';
  hud.innerHTML = '<span class="hud-count">--/--</span><span class="hud-label">shorts</span>';
  hud.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(0,0,0,0.85);
    backdrop-filter: blur(10px);
    padding: 10px 16px;
    border-radius: 50px;
    border: 1px solid rgba(255,255,255,0.1);
    z-index: 999999;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 8px;
  `;

  document.body.appendChild(hud);
  updateHUD();
}

function updateHUD() {
  chrome.runtime.sendMessage({ action: 'getStatus' }, (resp) => {
    if (resp && hud) {
      hud.querySelector('.hud-count').textContent = `${resp.count}/${resp.limit}`;

      if (resp.count >= resp.limit) {
        hud.style.borderColor = '#ff4444';
        hud.querySelector('.hud-count').style.color = '#ff4444';
      } else if (resp.count >= resp.limit * 0.8) {
        hud.style.borderColor = '#FFA500';
        hud.querySelector('.hud-count').style.color = '#FFA500';
      } else {
        hud.style.borderColor = 'rgba(255,255,255,0.1)';
        hud.querySelector('.hud-count').style.color = '#FF4500';
      }
    }
  });
}

// Start
init();