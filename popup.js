let blockStatusText = document.querySelector("#block-status");
let blockCheckbox = document.querySelector("#should-block");
let checked = true;

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