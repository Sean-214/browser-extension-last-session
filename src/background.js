import action from './lib/action';
import commands from './lib/commands';
import options from './lib/options';
import sessions from './lib/sessions';
import tabs from './lib/tabs';
import windows from './lib/windows';
import util from './lib/util';

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('onInstalled: ', details.reason);
    chrome.runtime.openOptionsPage();
  } else if (details.reason === 'update' && details.previousVersion) {
    console.log('onInstalled: ', details.reason, details.previousVersion);
    // 2.0.0 版本 FuncType 配置格式变更
    if (util.compareVersion(details.previousVersion, '2.0.0') < 0) {
      options.setFuncType(action.DEFAULT_FUNC_TYPE);
      chrome.runtime.openOptionsPage();
    }
  }
});

// 监听消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    switch (message.command) {
      case 'getTheme':
        const theme = await options.getTheme();
        sendResponse(theme);
        break;
      case 'getLastSession':
        const lastSession = await sessions.getLastSession();
        sendResponse(lastSession);
        break;
      case 'getRecents':
        const maxResults = await options.getRecentSize(action.DEFAULT_RECENT_SIZE);
        const recents = await sessions.getRecents({ maxResults });
        sendResponse(recents);
        break;
      case 'setRemoved':
        await sessions.setRemoved(message.data.url, message.data.removed);
        sendResponse();
        break;
    }
  })();
  return true;
});

// 窗口创建后，获取上次关闭窗口时未关闭的标签
windows.addCreatedListener();

// 标签更新后缓存标签信息，用于获取"favIconUrl"
tabs.addUpdatedListener();

// 监听扩展程序按钮单击事件
action.addClickedListener();

// 监听快捷键激活命令事件
commands.addCommandListener();

(async () => {
  await action.setTheme();
  await action.setFuncType();
})();
