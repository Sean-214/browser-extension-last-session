function setTitle(details) {
  return new Promise((resolve, reject) => {
    chrome.browserAction.setTitle(details, resolve);
  });
}

function setPopup(details) {
  return new Promise((resolve, reject) => {
    chrome.browserAction.setPopup(details, resolve);
  });
}

export default {
  setTitle,
  setPopup,
};
