// Shorts Guard - Blocked Page Script

document.addEventListener('DOMContentLoaded', init);

function init() {
  loadStatus();
  startCountdown();
}

// Load status to get count and reset time
function loadStatus() {
  chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
    if (response) {
      document.getElementById('count-display').textContent = response.count;
    }
  });
}

// Start countdown timer
function startCountdown() {
  chrome.runtime.sendMessage({ action: 'getResetTime' }, (response) => {
    if (response) {
      updateCountdown(response.resetTimestamp);
      setInterval(() => {
        updateCountdown(response.resetTimestamp);
      }, 1000);
    }
  });
}

// Update countdown display
function updateCountdown(resetTimestamp) {
  const now = new Date();
  const resetDate = new Date(resetTimestamp);

  if (resetDate <= now) {
    // Reset happened, redirect back
    window.location.href = 'https://www.youtube.com/shorts';
    return;
  }

  const diff = resetDate - now;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const hoursStr = hours.toString().padStart(2, '0');
  const minutesStr = minutes.toString().padStart(2, '0');
  const secondsStr = seconds.toString().padStart(2, '0');

  document.getElementById('countdown').textContent = `${hoursStr}:${minutesStr}:${secondsStr}`;
}