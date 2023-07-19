const forbiddenWebsites = [
  /youtube\.com\/(.*)/,
  /twitter\.com\/(.*)/,
  /instagram\.com\/(.*)/,
  /tiktok\.com\/(.*)/,
  /facebook\.com\/(.*)/,
];

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
  setInterval(check, 1000); 
}

chrome.runtime.onStartup.addListener(function() {
  start();
})

start();