import sessions from '../lib/sessions';
import tabs from '../lib/tabs';
import util from '../lib/util';
import { POPUP_PATH } from '../lib/constants';
import '../assets/iconfont/iconfont.css';
import '../assets/iconfont/iconfont.js';
import './recent.scss';

document.addEventListener('DOMContentLoaded', () => {
  // 国际化
  const MSG_TITLE_RECENT = chrome.i18n.getMessage('title_recent');
  const MSG_LAST_SESSION = chrome.i18n.getMessage('title');
  const MSG_HISTORY = chrome.i18n.getMessage('history');

  document.title = MSG_TITLE_RECENT;
  document.getElementById('title').textContent = MSG_TITLE_RECENT;

  // 上次未关闭页面按钮单击事件
  const btnLastSession = document.getElementById('last-session');
  btnLastSession.textContent = MSG_LAST_SESSION;
  btnLastSession.addEventListener('click', async () => {
    await tabs.active(chrome.runtime.getURL(POPUP_PATH));
  });

  // 历史按钮单击事件
  const btnHistory = document.getElementById('history');
  btnHistory.textContent = MSG_HISTORY;
  btnHistory.addEventListener('click', async () => {
    await tabs.create({ url: 'chrome://history', active: true });
  });

  // 主动获取主题
  chrome.runtime.sendMessage({ command: 'getTheme' }, theme => {
    document.body.className = theme;
  });
  // 主动获取最近关闭列表
  chrome.runtime.sendMessage({ command: 'getRecents' }, recents => {
    refreshRecentList(recents);
  });
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.command) {
      // 被动接收主题
      case 'setTheme':
        const theme = message.data;
        document.body.className = theme;
        sendResponse();
        break;
    }
    return true;
  });

  // 刷新最近关闭列表
  function refreshRecentList(recents) {
    const ul = document.getElementById('recent-list');
    util.emptyElement(ul);
    for (const item of recents) {
      // 创建图标
      let icon;
      if (item.favIconUrl) {
        icon = document.createElement('div');
        icon.className = 'icon';
        icon.style.backgroundImage = `url('${item.favIconUrl}')`;
      } else {
        icon = document.createElement('i');
        icon.className = 'icon iconfont icon-file';
      }
      // 创建标题
      const title = document.createElement('span');
      title.className = 'title';
      const titleText = document.createTextNode(item.title);
      title.title = item.title;
      title.appendChild(titleText);
      // 创建列表项
      const li = document.createElement('li');
      li.dataset.sessionId = item.sessionId;
      // 列表项单击事件
      li.addEventListener('click', async event => {
        event.preventDefault();
        const sessionId = li.dataset.sessionId;
        await sessions.restore(sessionId);
        window.close();
      });
      li.appendChild(icon);
      li.appendChild(title);
      ul.appendChild(li);
    }
  }
});
