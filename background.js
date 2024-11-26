// Liste contenant les regex des sites web interdits du localStorage.
let forbiddenWebsites = [];

/**
 * Récupère la liste de sites web dans le localStorage, les convertis en objet, crée un regex basé sur chaque site web et les insère dans la liste de sites web interdits.
 */
function fetchLocalStorageWebsitesList(){
  chrome.storage.local.get(["websites"], (result) => {
    forbiddenWebsites = []
    const storageWebsitesList = JSON.parse(result.websites)
  
    for (let i = 0; i < storageWebsitesList.length; i++) {
      const regex = new RegExp(storageWebsitesList[i]);
      forbiddenWebsites.push(regex)
    }
  });
}

fetchLocalStorageWebsitesList()

/**
 * Vérifie si l'utilisateur se trouve sur un site web bloqué. Si c'est le cas, on redirige vers la block page.
 */
function check() {
  chrome.storage.local.get(["key"], (result) => {
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

// Exécute check() lorsque l'onglet actif change
chrome.tabs.onActivated.addListener(() => {
  check();
});

// Exécute check() lorsque l'URL d'un onglet est mise à jour
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    check();
  }
});

// Écoute les modifications dans chrome.storage et exécute ffetchLocalStorageWebsitesList() et check()
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.key) {
    fetchLocalStorageWebsitesList()
    check();
  }
});