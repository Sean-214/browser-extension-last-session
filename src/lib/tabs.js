import storage from './storage';
import util from './util';

const CACHED_TABS = { cachedTabs: [] };

/**
 * 获取当前标签页
 */
function getCurrent() {
  return new Promise((resolve, reject) => {
    chrome.tabs.getCurrent(tab => {
      resolve(tab);
    });
  });
}

/**
 * 查询标签页
 */
function query(queryInfo = {}) {
  return new Promise((resolve, reject) => {
    chrome.tabs.query(queryInfo, tabs => {
      resolve(tabs);
    });
  });
}

/**
 * 创建标签页
 */
function create(createProperties = {}) {
  return new Promise((resolve, reject) => {
    chrome.tabs.create(createProperties, tab => {
      resolve(tab);
    });
  });
}

/**
 * 激活标签页，如果不存在则创建
 */
async function active(url) {
  if (!url) {
    return;
  }
  const tabList = await query({ windowId: chrome.windows.WINDOW_ID_CURRENT, url });
  if (tabList && tabList.length) {
    await update(tabList[0].id, { active: true });
    return;
  }
  await create({ url });
}

/**
 * 修改标签页
 */
function update(tabId = null, updateProperties = {}) {
  return new Promise((resolve, reject) => {
    chrome.tabs.update(tabId, updateProperties, tab => {
      resolve(tab);
    });
  });
}

/**
 * 关闭标签页
 */
function remove(tabIds) {
  return new Promise((resolve, reject) => {
    chrome.tabs.remove(tabIds, resolve);
  });
}

/**
 * 关闭当前标签页
 */
async function removeCurrent() {
  const tab = await getCurrent();
  if (tab) {
    await remove(tab.id);
  }
}

/**
 * 标签更新后缓存标签信息，用于获取"favIconUrl"
 */
function addUpdatedListener() {
  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.url || changeInfo.title || changeInfo.favIconUrl) {
      let cachedTabs = await getCachedTabs();
      const map = new Map();
      for (const item of cachedTabs) {
        map.set(item.url, item);
      }
      if (tab.favIconUrl) {
        tab.favIconDateUrl = await util.getBase64ByUrl(tab.favIconUrl);
      }
      map.set(tab.url, newTab(tab));
      cachedTabs = [...map.values()];
      await setCachedTabs(cachedTabs);
    }
  });
}

async function getCachedTabs() {
  const items = await storage.get(CACHED_TABS);
  return items.cachedTabs;
}

function setCachedTabs(cachedTabs = []) {
  return storage.set({ cachedTabs });
}

function newTab(tab) {
  return {
    url: tab.url,
    title: tab.title,
    favIconUrl: tab.favIconUrl,
    favIconDateUrl: tab.favIconDateUrl,
    removed: false,
  };
}

export default {
  getCurrent,
  query,
  create,
  active,
  update,
  remove,
  removeCurrent,
  addUpdatedListener,
  getCachedTabs,
  setCachedTabs,
  newTab,
};
