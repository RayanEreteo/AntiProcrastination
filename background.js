const forbiddenWebsites = [
  /youtube\.com\/(.*)/,
  /twitter\.com\/(.*)/,
  /instagram\.com\/(.*)/,
  /tiktok\.com\/(.*)/,
  /facebook\.com\/(.*)/,
];

let shouldBlock = true;
updateLocalStorage();



function check() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let currentTab = tabs[0];
    let currentUrl = currentTab.url;

    for (let i = 0; i < forbiddenWebsites.length; i++) {
      if (forbiddenWebsites[i].test(currentUrl)) {
        chrome.tabs.update({ url: './block_page.html' })
        break;
      }
    }
  });
}

function start() {
  setInterval(check, 1000);
}

chrome.runtime.onStartup.addListener(function () {
  start();
})
start();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleBlock") {
    shouldBlock = message.shouldBlock;
    updateLocalStorage();
    console.log(shouldBlock);
  }
});

function updateLocalStorage(){
  chrome.storage.local.set({ key: shouldBlock}, function () {
    console.log('Value is set to : ' + shouldBlock);
  });
}