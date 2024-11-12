// liste des sites web interdit
const forbiddenWebsites = [
  /youtube\.com\/(.*)/,
  /twitter\.com\/(.*)/,
  /instagram\.com\/(.*)/,
  /tiktok\.com\/(.*)/,
  /facebook\.com\/(.*)/,
];

// creation de la variable should block et appel de la fonction update pour mettre a jour le local storage directement.
let shouldBlock = true


// verifie si l'utilisateur est sur un site web bloque, si oui on redirige.
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

// commence le timer infinie pour appeller "check".
function start() {
  setInterval(check, 1000);
}


chrome.runtime.onStartup.addListener(function () {
  start();
})
start();

//recois le message du popup si l'utilisateur change l'etat de la checkbox.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleBlock") {
    //
  }
});