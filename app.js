const forbiddenWebsites = [
  /youtube\.com\/(.*)/,
  /twitter\.com\/(.*)/,
  /instagram\.com\/(.*)/,
  /tiktok\.com\/(.*)/,
  /facebook\.com\/(.*)/,
];

let shouldBlock = true

function check(){
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let currentTab = tabs[0];
    let currentUrl = currentTab.url;

    for (let i = 0; i < forbiddenWebsites.length; i++) {
      if (forbiddenWebsites[i].test(currentUrl)) {
        chrome.tabs.update({url: './block_page.html'})
        break;
      }
    }
  });
}
function start() {
  if (shouldBlock) {
    setInterval(check, 1000);     
  }
}

chrome.runtime.onStartup.addListener(function() {
  start();
})

start();