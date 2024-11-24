let blockCheckbox = document.querySelector("#should-block");
let input = document.querySelector("#website-input");
let button = document.querySelector("#block-button")
let websitesList = document.querySelector("#websites-list")

// Liste contenant les sites web du localStorage
let forbiddenWebsites = [];

button.addEventListener("click", addWebsite)

chrome.storage.local.get(["websites"], (result) => {
  forbiddenWebsites = JSON.parse(result.websites)

  for (let i = 0; i < forbiddenWebsites.length; i++) {
    updateWebsitesList(forbiddenWebsites[i])
  }
});

chrome.storage.local.get(["key"], (result) => {
  blockCheckbox.checked = result.key;

  if (blockCheckbox) {
    blockCheckbox.addEventListener("change", (e) => {
      updateLocalStorage()
    });
  }
});

function updateLocalStorage() {
  chrome.storage.local.set({ key: blockCheckbox.checked }, () => {
    console.log('Value is set to : ' + blockCheckbox.checked);
  });
}

function addWebsite() {
  const url = input.value

  if (url == "" || url == undefined || url == null) return console.log("no input")
  if (!url.includes(".com")) return console.log("No website");

  chrome.runtime.sendMessage({ url: input.value })
  forbiddenWebsites.push(url)
  chrome.storage.local.set({ websites: JSON.stringify(forbiddenWebsites) }, () => {
    console.log("websites : " + JSON.stringify(forbiddenWebsites));
  })

  updateWebsitesList(url)
  input.value = ""
}

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