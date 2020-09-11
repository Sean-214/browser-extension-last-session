import storage from './storage';
import tabs from './tabs';
import util from './util';

const LAST_SESSION = { lastSession: { lastModified: 0, tabs: [] } };

/**
 * 获取最近关闭的标签页和/或窗口的列表
 */
function getRecentlyClosed(filter = null) {
  return new Promise((resolve, reject) => {
    chrome.sessions.getRecentlyClosed(filter, resolve);
  });
}

/**
 * 重新打开窗口或标签页
 */
function restore(sessionId = null) {
  return new Promise((resolve, reject) => {
    chrome.sessions.restore(sessionId, resolve);
  });
}

async function getLastSession(filter) {
  let _filter = filter;
  if (!_filter) {
    _filter = item => !util.isInnerUrl(item.url) && !item.removed;
  }
  const items = await storage.get(LAST_SESSION);
  items.lastSession.tabs = items.lastSession.tabs.filter(_filter);
  return items.lastSession;
}

function setLastSession(lastSession = { lastModified: 0, tabs: [] }) {
  return storage.set({ lastSession });
}

async function setRemoved(url, removed) {
  const items = await storage.get(LAST_SESSION);
  const lastSession = items.lastSession;
  for (const item of lastSession.tabs) {
    if (!url || item.url === url) {
      item.removed = removed == null ? !item.removed : removed;
    }
  }
  await setLastSession(lastSession);
}

async function getRecents(filter = null) {
  const recents = [];
  const sessions = await getRecentlyClosed();
  const cachedTabs = await tabs.getCachedTabs();
  const cachedTabMap = new Map();
  for (const item of cachedTabs) {
    cachedTabMap.set(item.url, item);
  }
  for (const session of sessions) {
    if (session && session.tab && session.tab.sessionId != null && !util.isInnerUrl(session.tab.url)) {
      recents.push(session.tab);
      // 从缓存中获取favIconUrl
      if (!session.tab.favIconUrl) {
        const cachedTab = cachedTabMap.get(session.tab.url);
        if (cachedTab) {
          session.tab.favIconUrl = cachedTab.favIconUrl;
          session.tab.favIconDateUrl = cachedTab.favIconDateUrl;
        }
      }
    }
  }
  if (filter && filter.maxResults) {
    return recents.slice(0, filter.maxResults);
  }
  return recents;
}

export default {
  getRecentlyClosed,
  restore,
  getLastSession,
  setLastSession,
  setRemoved,
  getRecents,
};
