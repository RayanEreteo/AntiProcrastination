const forbiddenWebsites = [
  /youtube\.com\/(.*)/,
  /twitter\.com\/(.*)/,
  /instagram\.com\/(.*)/,
  /tiktok\.com\/(.*)/,
  /facebook\.com\/(.*)/,
];

// Verifies if the user is on a blocked website; if so, redirects.
function check() {
  // Get the current "key" value from chrome.storage each time check() is called
  chrome.storage.local.get(["key"], (result) => {
    console.log(result.key);
    if (result.key === true) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let currentTab = tabs[0];
        let currentUrl = currentTab.url;

        for (let i = 0; i < forbiddenWebsites.length; i++) {
          if (forbiddenWebsites[i].test(currentUrl)) {
            chrome.tabs.update({ url: './block_page.html' });
            break;
          }
        }
      });
    }
  });
}

// Run check() when the active tab changes
chrome.tabs.onActivated.addListener(() => {
  check();
});

// Run check() when the URL of a tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    check();
  }
});

// Listen for changes in chrome.storage and rerun check if "key" changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.key) {
    check();
  }
});