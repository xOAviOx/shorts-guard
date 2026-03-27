// Shorts Guard - Background Service Worker

const DEFAULT_LIMIT = 10;

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('Shorts Guard: Installing...');
  resetForNewDay();
  scheduleMidnightReset();
});

chrome.runtime.onStartup.addListener(() => {
  console.log('Shorts Guard: Starting...');
  resetForNewDay();
  scheduleMidnightReset();
});

// Reset for new day
function resetForNewDay() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  chrome.storage.local.get(null, (items) => {
    const storedDate = items.lastResetDate ? new Date(items.lastResetDate) : null;
    const shouldReset = !storedDate || storedDate < today;

    if (shouldReset) {
      chrome.storage.local.set({
        limit: items.limit || DEFAULT_LIMIT,
        count: 0,
        isOnboarded: items.isOnboarded || false,
        lastResetDate: today.toISOString(),
        resetAt: tomorrow.getTime()
      });
      console.log('Shorts Guard: Reset count for new day');
    }
  });
}

// Schedule midnight reset
function scheduleMidnightReset() {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const delayMs = midnight - now;

  chrome.alarms.create('midnightReset', {
    delayInMinutes: delayMs / 60000,
    periodInMinutes: 24 * 60
  });
  console.log('Shorts Guard: Alarm scheduled for midnight');
}

// Handle alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'midnightReset') {
    console.log('Shorts Guard: Midnight reset triggered');
    resetForNewDay();
    scheduleMidnightReset();
  }
});

// Handle messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Shorts Guard: Message received:', message.action);

  if (message.action === 'getStatus') {
    chrome.storage.local.get(['limit', 'count', 'isOnboarded', 'resetAt'], (items) => {
      sendResponse({
        limit: items.limit || DEFAULT_LIMIT,
        count: items.count || 0,
        isOnboarded: items.isOnboarded || false,
        resetAt: items.resetAt || (Date.now() + 24 * 60 * 60 * 1000)
      });
    });
    return true;
  }

  if (message.action === 'setLimit') {
    chrome.storage.local.set({
      limit: message.limit,
      isOnboarded: true
    }, () => {
      console.log('Shorts Guard: Limit set to', message.limit);
      sendResponse({ success: true });
    });
    return true;
  }

  if (message.action === 'incrementCount') {
    chrome.storage.local.get(['limit', 'count'], (items) => {
      const newCount = (items.count || 0) + 1;
      chrome.storage.local.set({ count: newCount }, () => {
        console.log('Shorts Guard: Count incremented to', newCount);
        sendResponse({ count: newCount, limit: items.limit });
      });
    });
    return true;
  }

  if (message.action === 'resetCount') {
    chrome.storage.local.set({ count: 0 }, () => {
      console.log('Shorts Guard: Count reset');
      sendResponse({ success: true });
    });
    return true;
  }
});