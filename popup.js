let blockCheckbox = document.querySelector("#should-block");
let input = document.querySelector("#website-input");
let button = document.querySelector("#block-button")
let websitesList = document.querySelector("#websites-list")

const forbiddenWebsites = [];

button.addEventListener("click", addWebsite)

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
  chrome.storage.local.get(["websites"], (result) => {
    console.log(result);
  })
  updateWebsitesList(url)
  input.value = ""
}

function updateWebsitesList(url){
    let p = document.createElement("p")
    
    p.innerText = url

    websitesList.append(p)
}