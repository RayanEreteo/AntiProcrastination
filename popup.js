let blockCheckbox = document.querySelector("#should-block");
let input = document.querySelector("#website-input");
let button = document.querySelector("#block-button")
let websitesList = document.querySelector("#websites-list")

//? "Liste visuelle" fait référence au conteneur de tous les sites web sur le popup.

// Liste contenant les sites web du localStorage.
let forbiddenWebsites = [];

button.addEventListener("click", addWebsite)

// Récupération des sites web interdits dans le localStorage et met à jour la liste visuelle.
chrome.storage.local.get(["websites"], (result) => {
  forbiddenWebsites = JSON.parse(result.websites)

  for (let i = 0; i < forbiddenWebsites.length; i++) {
    updateWebsitesList(forbiddenWebsites[i])
  }
});

// Récupération de la valeur de la checkbox dans le localStorage et coche la checkbox en fonction du résultat.
chrome.storage.local.get(["key"], (result) => {
  blockCheckbox.checked = result.key;

  // Mets à jour la valeur "key" dans le localStorage en cas de changement de la checkbox
  blockCheckbox.addEventListener("change", (e) => {
    chrome.storage.local.set({ key: blockCheckbox.checked }, () => {
      console.log('Value is set to : ' + blockCheckbox.checked);
    });
  });
});

/**
 * Ajoute un site web au localStorage et à la liste visuelle.
 */
function addWebsite() {
  const url = input.value

  if (url == "" || url == undefined || url == null) return console.log("no input")
  if (!url.includes(".com")) return console.log("No website");

  forbiddenWebsites.push(url)
  chrome.storage.local.set({ websites: JSON.stringify(forbiddenWebsites) }, () => {
    console.log("websites : " + JSON.stringify(forbiddenWebsites));
  })

  updateWebsitesList(url)
  input.value = ""
}

/**
 * Mets à jour la liste visuels.
 * @param {String} url
 */
function updateWebsitesList(url) {
  let container = document.createElement("div")
  container.className = "website-layout"
  container.id = url

  let p = document.createElement("p")
  p.className = "website-layout-text"
  p.innerText = url

  let deleteButton = document.createElement("button")
  deleteButton.className = "website-layout-button"
  deleteButton.textContent = "effacer"
  deleteButton.onclick = () => clearSingleWebsite(container.id)


  container.appendChild(p)
  container.appendChild(deleteButton)
  websitesList.append(container)
}

/**
 * Retire un site web du localStorage et de la liste visuel.
 * @param {String} id l'ID du div du site web a retirer.
 */
function clearSingleWebsite(id) {
  if (forbiddenWebsites.includes(id)) {
    const filteredArr = forbiddenWebsites.filter((val, index) => {
      return val != id
    })

    forbiddenWebsites = filteredArr

    chrome.storage.local.set({ websites: JSON.stringify(forbiddenWebsites) }, () => {
      console.log("websites : " + JSON.stringify(forbiddenWebsites));
    })

    document.getElementById(id).remove();
  }
}