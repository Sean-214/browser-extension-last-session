import storage from './storage';
import util from './util';

const CACHED_TABS = { cachedTabs: [] };
const EXPIRES = 7 * 24 * 60 * 60 * 1000;

/**
 * 获取当前标签页
 */
function getCurrent() {
  return chrome.tabs.getCurrent();
}

/**
 * 查询标签页
 */
function query(queryInfo = {}) {
  return chrome.tabs.query(queryInfo);
}

/**
 * 创建标签页
 */
function create(createProperties = {}) {
  return chrome.tabs.create(createProperties);
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
  return chrome.tabs.update(tabId, updateProperties);
}

/**
 * 关闭标签页
 */
function remove(tabIds) {
  return chrome.tabs.remove(tabIds);
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
 * 将标签页添加到指定的组
 */
function group(groupId, tabIds) {
  groupId = parseInt(groupId, 10);
  return chrome.tabs.group({ groupId, tabIds });
}

/**
 * 从各自的组中删除标签页
 */
function ungroup(tabIds) {
  return chrome.tabs.ungroup(tabIds);
}

/**
 * 标签更新后缓存标签信息，用于获取"favIconUrl"
 */
function addUpdatedListener() {
  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.url || changeInfo.title || changeInfo.favIconUrl) {
      let cachedTabs = await getCachedTabs();
      const cachedTabMap = new Map();
      for (const item of cachedTabs) {
        cachedTabMap.set(item.url, item);
      }
      const now = Date.now();
      if (tab.favIconUrl) {
        const favIconDateUrl = await util.getBase64ByUrl(tab.favIconUrl);
        cachedTabMap.set(tab.url, { ...newTab(tab), favIconDateUrl, expires: now });
      }
      cachedTabs = [];
      for (const item of cachedTabMap.values()) {
        if (now - item.expires < EXPIRES) {
          cachedTabs.push(item);
        }
      }
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
    groupId: tab.groupId,
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
  group,
  ungroup,
  addUpdatedListener,
  getCachedTabs,
  setCachedTabs,
  newTab,
};
