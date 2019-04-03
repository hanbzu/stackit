/*global chrome*/

// Listen for console.log needs in the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "BG_LOG":
      console.log(message.obj);
      break;
    default:
      console.error("Unknown message type", message.type);
  }
  return true;
});
