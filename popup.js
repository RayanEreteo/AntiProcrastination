let blockCheckbox = document.querySelector("#should-block");
let input = document.querySelector("#website-input");
let button = document.querySelector("#block-button")
let websitesList = document.querySelector("#websites-list")

let forbiddenWebsites = [];

button.addEventListener("click", addWebsite)

chrome.storage.local.get(["websites"], (result) => {
  forbiddenWebsites = JSON.parse(result.websites)

  for (let i = 0; i < forbiddenWebsites.length; i++) {
    let p = document.createElement("p")

    p.innerText = forbiddenWebsites[i]
    websitesList.append(p)
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
    p.innerText = url

    let deleteButton = document.createElement("button")
    deleteButton.textContent = "effacer"


    container.appendChild(p)
    container.appendChild(deleteButton)
    websitesList.append(container)
}


function clearSingleWebsite(){
 //? A faire
}


//! Debug uniquement (surement ?)
function clearAllWebsitesStorage(){
  chrome.storage.local.remove("websites")
}