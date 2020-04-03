function get(keys) {
  return new Promise(async (resolve, reject) => {
    chrome.storage.local.get(keys, resolve);
  });
}

function set(items) {
  return new Promise(async (resolve, reject) => {
    chrome.storage.local.set(items, resolve);
  });
}

function remove(keys) {
  return new Promise(async (resolve, reject) => {
    chrome.storage.local.remove(keys, resolve);
  });
}

function clear() {
  return new Promise(async (resolve, reject) => {
    chrome.storage.local.clear(resolve);
  });
}

export default {
  get,
  set,
  remove,
  clear,
};
