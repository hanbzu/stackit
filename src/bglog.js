/*global chrome*/

export default function bglog(obj) {
  if (process.env.NODE_ENV === "development") console.log(obj);
  else chrome.runtime.sendMessage({ type: "BG_LOG", obj: obj });
}
