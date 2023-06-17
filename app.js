const BUTTON = document.getElementById("switch-block-button");

let currentlyBlocking = false;

let forbiddenWebsites = ['https://www.youtube.com/'];

BUTTON.addEventListener("click", () => {
  currentlyBlocking = !currentlyBlocking;

  switch (currentlyBlocking) {
    case false:
      BUTTON.innerHTML = "Bloquer";
      break;

    case true:
      BUTTON.innerHTML = "Débloquer";
      break;

    default:
      break;
  }
});

setInterval(() => {
  if (currentlyBlocking) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let currentTab = tabs[0];
      let currentUrl = currentTab.url;
      let currentTabId = currentTab.id;

      if (forbiddenWebsites.includes(currentUrl)) {
        chrome.tabs.remove(currentTabId);
      }
    });
  }
}, 1000);
