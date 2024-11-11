let blockStatusText = document.querySelector("#block-status")
let blockCheckbox = document.querySelector("#should-block")

if(blockCheckbox){
  blockCheckbox.addEventListener("change", (e) => {
    chrome.runtime.sendMessage({ action: "toggleBlock", shouldBlock: e.target.checked });
  })
}