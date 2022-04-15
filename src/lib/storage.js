function get(keys) {
  return chrome.storage.local.get(keys);
}

function set(items) {
  return chrome.storage.local.set(items);
}

function remove(keys) {
  return chrome.storage.local.remove(keys);
}

function clear() {
  return chrome.storage.local.clear();
}

export default {
  get,
  set,
  remove,
  clear,
};
