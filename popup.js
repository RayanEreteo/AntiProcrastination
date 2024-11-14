let blockCheckbox = document.querySelector("#should-block");
let input = document.querySelector("#website-input");
let button = document.querySelector("#block-button")
let websitesList = document.querySelector("#websites-list")

const forbiddenWebsites = ["youtube.com", "facebook.com"];

button.addEventListener("click", addWebsite)

chrome.storage.local.get(["key"], (result) => {
  checked = result.key;
  blockCheckbox.checked = checked;
  
  if(blockCheckbox){
    blockCheckbox.addEventListener("change", (e) => {
      updateLocalStorage()
    });
  }
});

function updateLocalStorage(){
  chrome.storage.local.set({ key: blockCheckbox.checked}, function () {
    console.log('Value is set to : ' + blockCheckbox.checked);
  });
}

function addWebsite() {
  chrome.runtime.sendMessage({url: input.value})
  updateWebsitesList()
  input.value = ""
}

function updateWebsitesList(){
  for (let i = 0; i < forbiddenWebsites.length; i++) {
    let p = document.createElement("p")

    p.innerText = forbiddenWebsites[i]

    websitesList.append(p)
  }
}