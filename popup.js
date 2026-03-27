// Shorts Guard - Popup Script

document.addEventListener('DOMContentLoaded', () => {
  console.log('Popup: Loading...');
  loadStatus();
});

function loadStatus() {
  chrome.runtime.sendMessage({ action: 'getStatus' }, (resp) => {
    console.log('Popup: Got status:', resp);

    if (!resp || !resp.isOnboarded) {
      showOnboarding();
    } else {
      showMain(resp);
    }
  });
}

function showOnboarding() {
  document.getElementById('onboarding-view').classList.remove('hidden');
  document.getElementById('main-view').classList.add('hidden');
  document.getElementById('limit-input').value = 10;
}

function showMain(resp) {
  document.getElementById('onboarding-view').classList.add('hidden');
  document.getElementById('main-view').classList.remove('hidden');

  document.getElementById('current-count').textContent = resp.count;
  document.getElementById('limit-display').textContent = resp.limit;

  const pct = (resp.count / resp.limit) * 100;
  document.getElementById('progress-bar').style.width = pct + '%';

  const resetDate = new Date(resp.resetAt);
  const hrs = resetDate.getHours();
  const mins = resetDate.getMinutes();
  const ampm = hrs >= 12 ? 'PM' : 'AM';
  document.getElementById('reset-time').textContent =
    `Resets at ${hrs % 12 || 12}:${mins.toString().padStart(2, '0')} ${ampm}`;
}

// Confirm limit
document.getElementById('confirm-limit').addEventListener('click', () => {
  const limit = Math.max(1, Math.min(100, parseInt(document.getElementById('limit-input').value) || 10));
  console.log('Popup: Setting limit to', limit);

  chrome.runtime.sendMessage({ action: 'setLimit', limit: limit }, () => {
    setTimeout(loadStatus, 200);
  });
});

// Change limit modal
document.getElementById('change-limit-btn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'getStatus' }, (resp) => {
    document.getElementById('new-limit-input').value = resp.limit;
    document.getElementById('change-limit-modal').classList.remove('hidden');
  });
});

document.getElementById('cancel-limit').addEventListener('click', () => {
  document.getElementById('change-limit-modal').classList.add('hidden');
});

document.getElementById('save-limit').addEventListener('click', () => {
  const limit = Math.max(1, Math.min(100, parseInt(document.getElementById('new-limit-input').value) || 10));
  chrome.runtime.sendMessage({ action: 'setLimit', limit: limit }, () => {
    document.getElementById('change-limit-modal').classList.add('hidden');
    setTimeout(loadStatus, 200);
  });
});

// Reset
document.getElementById('reset-btn').addEventListener('click', () => {
  if (confirm('Reset today\'s count?')) {
    chrome.runtime.sendMessage({ action: 'resetCount' }, () => {
      setTimeout(loadStatus, 200);
    });
  }
});