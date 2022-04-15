import storage from './storage';

const CACHED_TAB_GROUPS = { cachedTabGroups: [] };
const EXPIRES = 7 * 24 * 60 * 60 * 1000;

/**
 * 获取标签页组
 */
function get(groupId) {
  return chrome.tabGroups.get(groupId);
}

/**
 * 移动标签页组
 */
function move(groupId = null, moveProperties = {}) {
  return chrome.tabGroups.move(groupId, moveProperties);
}

/**
 * 查询标签页组
 */
function query(queryInfo = {}) {
  return chrome.tabGroups.query(queryInfo);
}

/**
 * 修改标签页组
 */
function update(groupId = null, updateProperties = {}) {
  return chrome.tabGroups.update(groupId, updateProperties);
}

/**
 * 标签组更新后缓存标签组信息
 */
function addUpdatedListener() {
  chrome.tabGroups.onUpdated.addListener(async (tabGroup) => {
    let cachedTabGroups = await getCachedTabGroups();
    const cachedTabGroupMap = new Map();
    for (const item of cachedTabGroups) {
      cachedTabGroupMap.set(item.id, item);
    }
    const now = Date.now();
    cachedTabGroupMap.set(tabGroup.id, { ...newTabGroup(tabGroup), expires: now });
    cachedTabGroups = [];
    for (const item of cachedTabGroupMap.values()) {
      if (now - item.expires < EXPIRES) {
        cachedTabGroups.push(item);
      }
    }
    await setCachedTabGroups(cachedTabGroups);
  });
}

async function getCachedTabGroups() {
  const items = await storage.get(CACHED_TAB_GROUPS);
  return items.cachedTabs;
}

function setCachedTabGroups(cachedTabGroups = []) {
  return storage.set({ cachedTabGroups });
}

function newTabGroup(tabGroup) {
  return {
    id: tabGroup.id,
    title: tabGroup.title,
    color: tabGroup.color,
  };
}

export default {
  get,
  move,
  query,
  update,
};
