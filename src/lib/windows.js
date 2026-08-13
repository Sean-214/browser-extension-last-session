import options from './options';
import sessions from './sessions';
import tabs from './tabs';
import util from './util';

/**
 * 获取最近关闭的标签页和/或窗口的列表
 * 当上次未关闭页面为首页时无法保证Created事件和DOMContentLoaded事件的执行顺序
 */
function addCreatedListener() {
  chrome.windows.onCreated.addListener(async (window) => {
    const lastSession = await sessions.getLastSession();
    const recentlyClosedSessions = await sessions.getRecentlyClosed();
    const lastSessionMap = new Map();
    for (const item of lastSession.tabs) {
      lastSessionMap.set(item.url, item);
    }
    const session = recentlyClosedSessions[0];
    if (session && session.lastModified > lastSession.lastModified) {
      lastSession.lastModified = session.lastModified;
      const sessionTabs = session.tab ? [session.tab] : session.window.tabs;
      if (sessionTabs && sessionTabs.length) {
        const excludeGroupedTabs = await options.getExcludeGroupedTabs();
        const queriedTabs = await tabs.query();
        const queriedTabMap = new Map();
        for (const item of queriedTabs) {
          queriedTabMap.set(item.url, item);
        }
        const cachedTabs = await tabs.getCachedTabs();
        const cachedTabMap = new Map();
        for (const item of cachedTabs) {
          cachedTabMap.set(item.url, item);
        }
        for (const item of sessionTabs) {
          if (!util.isInnerUrl(item.url)) {
            const queriedTab = queriedTabMap.get(item.url) || {};
            const cachedTab = cachedTabMap.get(item.url) || {};
            if (queriedTab.groupId > 0) {
              cachedTab.groupId = queriedTab.groupId;
            }
            if (!excludeGroupedTabs || !queriedTab.groupId || queriedTab.groupId <= 0) {
              lastSessionMap.set(item.url, tabs.newTab({ ...item, ...cachedTab }));
            }
          }
        }
        await tabs.setCachedTabs(cachedTabs);
      }
    }
    lastSession.tabs = [...lastSessionMap.values()];
    await sessions.setLastSession(lastSession);
    try {
      await chrome.runtime.sendMessage({ command: 'setLastSession', data: lastSession });
    } catch (e) {}
  });
}

export default {
  addCreatedListener,
};
