const forbiddenWebsites = [
];

// Vérifie si l'utilisateur se trouve sur un site Web bloqué ; si c'est le cas, redirige.
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

// Exécutez check() lorsque l'onglet actif change
chrome.tabs.onActivated.addListener(() => {
  check();
});

// Exécutez check() lorsque l'URL d'un onglet est mise à jour
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    check();
  }
});

// Écoutez les modifications dans chrome.storage et réexécutez pour vérifier si la "clé" change
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.key) {
    check();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const url = request.url;
  const escapedUrl = url.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&'); // Escapes special regex characters
  
  // Crée une regex qui correspond au domaine complet (début de la chaîne)
  const regex = new RegExp('^https?://(?:www\\.)?' + escapedUrl);  // Match "http://youtube.com" or "https://youtube.com"
  
  forbiddenWebsites.push(regex); // Push au tableau des sites interdit
  console.log(regex);
});
