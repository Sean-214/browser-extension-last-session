import sessions from './sessions';
import tabs from './tabs';
import { POPUP_PATH } from './constants';

/**
 * 获取最近关闭的标签页和/或窗口的列表
 * 当上次未关闭页面为首页时无法保证Created事件和DOMContentLoaded事件的执行顺序
 */
function addCreatedListener() {
  chrome.windows.onCreated.addListener(async window => {
    const lastSession = await sessions.getLastSession();
    const cachedTabs = await tabs.getCachedTabs();
    const recentlyClosedSessions = await sessions.getRecentlyClosed();
    const url = chrome.runtime.getURL(POPUP_PATH);
    const map = new Map();
    for (const item of lastSession.tabs) {
      map.set(item.url, item);
    }
    const session = recentlyClosedSessions[0];
    if (session && session.lastModified > lastSession.lastModified) {
      lastSession.lastModified = session.lastModified;
      const tabList = session.tab ? [session.tab] : session.window.tabs;
      if (tabList && tabList.length) {
        const cachedTabMap = new Map();
        for (const item of cachedTabs) {
          cachedTabMap.set(item.url, item);
        }
        for (const item of tabList) {
          if (item.url !== url) {
            const cachedTab = cachedTabMap.get(item.url) || {};
            map.set(item.url, tabs.newTab({ ...item, ...cachedTab }));
          }
        }
      }
    }
    lastSession.tabs = [...map.values()];
    await sessions.setLastSession(lastSession);
    await tabs.setCachedTabs();
    chrome.runtime.sendMessage({ command: 'setLastSession', data: lastSession });
  });
}

export default {
  addCreatedListener,
};
