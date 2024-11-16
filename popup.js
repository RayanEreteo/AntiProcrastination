let blockCheckbox = document.querySelector("#should-block");
let input = document.querySelector("#website-input");
let button = document.querySelector("#block-button")
let websitesList = document.querySelector("#websites-list")

let forbiddenWebsites = [];


//clearAllWebsitesStorage()

button.addEventListener("click", addWebsite)

chrome.storage.local.get(["websites"], (result) => {
  forbiddenWebsites = JSON.parse(result.websites)

  for (let i = 0; i < forbiddenWebsites.length; i++) {
    let container = document.createElement("div")
    container.className = "website-layout"

    let p = document.createElement("p")
    p.id = forbiddenWebsites[i]
    p.innerText = forbiddenWebsites[i]

    let deleteButton = document.createElement("button")
    deleteButton.textContent = "effacer"
    deleteButton.onclick = () => clearSingleWebsite(p.id)


    container.appendChild(p)
    container.appendChild(deleteButton)
    websitesList.append(container)
  }
});

chrome.storage.local.get(["key"], (result) => {
  blockCheckbox.checked = result.key;
  
  if(blockCheckbox){
    blockCheckbox.addEventListener("change", (e) => {
      updateLocalStorage()
    });
  }
});

function updateLocalStorage(){
  chrome.storage.local.set({ key: blockCheckbox.checked}, () => {
    console.log('Value is set to : ' + blockCheckbox.checked);
  });
}

function addWebsite() {
  const url = input.value

  if (url == "" || url == undefined || url == null) return console.log("no input")
  if (!url.includes(".com")) return console.log("No website");

  chrome.runtime.sendMessage({url: input.value})
  forbiddenWebsites.push(url)
  chrome.storage.local.set({websites: JSON.stringify(forbiddenWebsites)}, () => {
    console.log("websites : " + JSON.stringify(forbiddenWebsites));
  })

  updateWebsitesList(url)
  input.value = ""
}

function updateWebsitesList(url){
    let container = document.createElement("div")
    container.className = "website-layout"

    let p = document.createElement("p")
    p.id = url
    p.innerText = url

    let deleteButton = document.createElement("button")
    deleteButton.textContent = "effacer"
    deleteButton.onclick = () => clearSingleWebsite(p.id)


    container.appendChild(p)
    container.appendChild(deleteButton)
    websitesList.append(container)
}


function clearSingleWebsite(id){
 if (forbiddenWebsites.includes(id)) {
  const filteredArr = forbiddenWebsites.filter((val, index) => {
    return val != id
  })

  forbiddenWebsites = filteredArr

  chrome.storage.local.set({websites: JSON.stringify(forbiddenWebsites)}, () => {
    console.log("websites : " + JSON.stringify(forbiddenWebsites));
  })
 }
}


//! Debug uniquement (surement ?)
function clearAllWebsitesStorage(){
  chrome.storage.local.remove("websites")
}