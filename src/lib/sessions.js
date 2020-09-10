import storage from './storage';
import util from './util';

const LAST_SESSION = { lastSession: { lastModified: 0, tabs: [] } };
const CACHED_RECENTS = { cachedRecents: {} };
const EXPIRES = 7 * 24 * 60 * 60 * 1000;

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
  const tabs = [];
  const sessions = await getRecentlyClosed();
  const cachedRecents = await getCachedRecents();
  const now = Date.now();
  for (const session of sessions) {
    if (session && session.tab && session.tab.sessionId != null && !util.isInnerUrl(session.tab.url)) {
      tabs.push(session.tab);
      // 从缓存中获取favIconUrl
      const key = session.tab.url;
      const favIconUrl = session.tab.favIconUrl;
      if (favIconUrl) {
        cachedRecents[key] = { favIconUrl, expires: now };
      } else if (cachedRecents[key]) {
        session.tab.favIconUrl = cachedRecents[key].favIconUrl;
        // 更新缓存过期时间
        cachedRecents[key].expires = now;
      }
    }
  }
  // 更新缓存
  for (const [key, value] of Object.entries(cachedRecents)) {
    if (now - value.expires > EXPIRES) {
      delete cachedRecents[key];
    }
  }
  await setCachedRecents(cachedRecents);
  if (filter && filter.maxResults) {
    return tabs.slice(0, filter.maxResults);
  }
  return tabs;
}

async function getCachedRecents() {
  const items = await storage.get(CACHED_RECENTS);
  return items.cachedRecents;
}

function setCachedRecents(cachedRecents = {}) {
  return storage.set({ cachedRecents });
}

export default {
  getRecentlyClosed,
  restore,
  getLastSession,
  setLastSession,
  setRemoved,
  getRecents,
};
