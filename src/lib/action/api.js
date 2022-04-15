function setTitle(details) {
  return chrome.action.setTitle(details);
}

function setPopup(details) {
  return chrome.action.setPopup(details);
}

function setIcon(details) {
  return chrome.action.setIcon(details);
}

function addClickedListener(callback) {
  chrome.action.onClicked.addListener(callback);
}

export default {
  setTitle,
  setPopup,
  setIcon,
  addClickedListener,
};
