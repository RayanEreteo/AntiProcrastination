let blockCheckbox = document.querySelector("#should-block");
let input = document.querySelector("#website-input");
let button = document.querySelector("#block-button")

button.addEventListener("click", buttonTest)

chrome.storage.local.get(["key"], (result) => {
  checked = result.key;
  
  blockCheckbox.checked = checked;
  
  if(blockCheckbox){
    blockCheckbox.addEventListener("change", (e) => {
      chrome.runtime.sendMessage({ action: "toggleBlock", shouldBlock: result.key });

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
  chrome.runtime.sendMessage({url: "youtube.com"})
}