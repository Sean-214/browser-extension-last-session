import ClipboardJS from 'clipboard';
import browserAction from '../lib/browser-action';
import options from '../lib/options';
import util from '../lib/util';
import { POPUP_PATH, THEME_LIST } from '../lib/constants';
import './options.scss';

document.addEventListener('DOMContentLoaded', async () => {
  // 国际化
  const MSG_TITLE = chrome.i18n.getMessage('title');
  const MSG_COPY_TO_CLIPBOARD = chrome.i18n.getMessage('copyToClipboard');
  const MSG_THEME_LABEL = chrome.i18n.getMessage('themeLabel');
  const MSG_FUNC_TYPE_LABEL = chrome.i18n.getMessage('funcTypeLabel');
  const MSG_CLEAR_DATA = chrome.i18n.getMessage('clearData');

  document.getElementById('urlLabel').textContent = MSG_TITLE;
  document.getElementById('themeLabel').textContent = MSG_THEME_LABEL;
  document.getElementById('funcTypeLabel').textContent = MSG_FUNC_TYPE_LABEL;

  // 显示上次未关闭页面的URL
  const url = document.getElementById('url');
  url.textContent = chrome.runtime.getURL(POPUP_PATH);
  url.title = MSG_COPY_TO_CLIPBOARD;
  new ClipboardJS(url, {
    text: trigger => url.textContent,
  });

  // 初始化主题
  const theme = document.getElementById('theme');
  util.emptyElement(theme);
  for (const item of THEME_LIST) {
    const option = document.createElement('option');
    option.value = item.value;
    option.text = chrome.i18n.getMessage(item.label);
    theme.add(option);
  }
  theme.value = await options.getTheme();
  theme.addEventListener('change', async event => {
    await browserAction.setTheme(event.target.value);
    await options.setTheme(event.target.value);
  });
  // 初始化选择单击图标的功能
  const funcType = document.getElementById('funcType');
  util.emptyElement(funcType);
  for (const item of browserAction.FUNC_TYPE_LIST) {
    const option = document.createElement('option');
    option.value = item.value;
    option.text = item.label;
    funcType.add(option);
  }
  funcType.value = await options.getFuncType(browserAction.DEFAULT_FUNC_TYPE.value);
  funcType.addEventListener('change', async event => {
    await browserAction.setFuncType(event.target.value);
    await options.setFuncType(event.target.value);
  });
  // 清除数据
  const clearData = document.getElementById('clearData');
  clearData.textContent = MSG_CLEAR_DATA;
  clearData.addEventListener('click', async event => {
    await options.clear();
  });
});
