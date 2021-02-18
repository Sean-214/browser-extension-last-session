import tabs from '../lib/tabs';
import util from '../lib/util';
import '../assets/iconfont/iconfont.css';
import '../assets/iconfont/iconfont.js';
import './popup.scss';

document.addEventListener('DOMContentLoaded', () => {
  // 国际化
  const MSG_TITLE = chrome.i18n.getMessage('title');
  const MSG_VIEW_HISTORY = chrome.i18n.getMessage('viewHistory');
  const MSG_REMOVE_ALL = chrome.i18n.getMessage('removeAll');
  const MSG_OPEN_ALL = chrome.i18n.getMessage('openAll');

  document.title = MSG_TITLE;
  document.getElementById('title').textContent = MSG_TITLE;

  // 全部删除按钮单击事件
  const removeAll = document.getElementById('remove-all');
  removeAll.textContent = MSG_REMOVE_ALL;
  removeAll.addEventListener('click', () => {
    const ul = document.getElementById('tab-list');
    let removed = false;
    for (const li of ul.children) {
      if (!li.className) {
        removed = true;
        break;
      }
    }
    for (const li of ul.children) {
      li.className = removed ? 'removed' : '';
    }
    chrome.runtime.sendMessage({ command: 'setRemoved', data: { removed } });
  });

  // 打开全部按钮单击事件
  const openAll = document.getElementById('open-all');
  openAll.textContent = MSG_OPEN_ALL;
  openAll.addEventListener('click', async () => {
    const ul = document.getElementById('tab-list');
    for (const li of ul.children) {
      if (!li.className) {
        const url = li.dataset.tabUrl;
        await tabs.create({ url, active: false });
      }
    }
    chrome.runtime.sendMessage({ command: 'setRemoved', data: { removed: true } });
    await tabs.removeCurrent();
  });

  // 查看历史按钮单击事件
  const viewHistory = document.getElementById('view-history');
  viewHistory.textContent = MSG_VIEW_HISTORY;
  viewHistory.addEventListener('click', async () => {
    await tabs.create({ url: 'chrome://history', active: true });
  });

  let lastSession = null;
  // 主动获取主题
  chrome.runtime.sendMessage({ command: 'getTheme' }, theme => {
    document.body.className = theme;
  });
  // 主动获取标签列表
  chrome.runtime.sendMessage({ command: 'getLastSession' }, session => {
    lastSession = lastSession || session;
    if (session.lastModified > lastSession.lastModified) {
      lastSession = session;
    }
    refreshTabList(lastSession);
  });
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.command) {
      // 被动接收主题
      case 'setTheme':
        const theme = message.data;
        document.body.className = theme;
        sendResponse();
        break;
      // 被动接收标签列表
      case 'setLastSession':
        const session = message.data;
        lastSession = lastSession || session;
        if (session.lastModified > lastSession.lastModified) {
          lastSession = session;
        }
        refreshTabList(lastSession);
        sendResponse();
        break;
      // 监听清除数据
      case 'clearStorage':
        const ul = document.getElementById('tab-list');
        util.emptyElement(ul);
        sendResponse();
        break;
    }
    return true;
  });

  // 刷新标签列表
  function refreshTabList(lastSession) {
    const ul = document.getElementById('tab-list');
    util.emptyElement(ul);
    for (const item of lastSession.tabs) {
      // 创建删除按钮
      const btn = document.createElement('i');
      btn.className = 'btn iconfont icon-close';
      // 删除按钮单击事件
      btn.addEventListener('click', event => {
        const li = event.target.parentNode;
        li.className = li.className ? '' : 'removed';
        const url = li.dataset.tabUrl;
        chrome.runtime.sendMessage({ command: 'setRemoved', data: { url } });
      });
      // 创建图标
      let icon;
      if (item.favIconDateUrl) {
        icon = document.createElement('div');
        icon.className = 'icon';
        icon.style.backgroundImage = `url('${item.favIconDateUrl}')`;
      } else if (item.favIconUrl) {
        icon = document.createElement('div');
        icon.className = 'icon';
        icon.style.backgroundImage = `url('${item.favIconUrl}')`;
      } else {
        icon = document.createElement('i');
        icon.className = 'icon iconfont icon-file';
      }
      // 创建标题
      const title = document.createElement('a');
      title.className = 'title';
      title.href = item.url;
      // 标题单击事件
      title.addEventListener('click', async event => {
        event.preventDefault();
        const li = event.target.parentNode;
        li.className = 'removed';
        const url = li.dataset.tabUrl;
        await tabs.create({ url, active: false });
        chrome.runtime.sendMessage({ command: 'setRemoved', data: { url, removed: true } });
      });
      const titleText = document.createTextNode(item.title);
      title.title = item.title;
      title.appendChild(titleText);
      // 创建列表项
      const li = document.createElement('li');
      li.dataset.tabUrl = item.url;
      li.className = item.removed ? 'removed' : '';
      li.appendChild(btn);
      li.appendChild(icon);
      li.appendChild(title);
      ul.appendChild(li);
    }
  }
});
