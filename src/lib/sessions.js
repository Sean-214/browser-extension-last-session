import storage from './storage';
import { POPUP_PATH } from './constants';

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
    const url = chrome.runtime.getURL(POPUP_PATH);
    _filter = item => item.url !== url && !item.removed;
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

export default {
  getRecentlyClosed,
  restore,
  getLastSession,
  setLastSession,
  setRemoved,
};
