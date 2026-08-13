import ClipboardJS from 'clipboard';
import action from '../lib/action';
import options from '../lib/options';
import util from '../lib/util';
import { POPUP_PATH, THEME_LIST, COMMON_YES, COMMON_NO } from '../lib/constants';
import './options.less';

document.addEventListener('DOMContentLoaded', async () => {
  // 国际化
  const MSG_TITLE = chrome.i18n.getMessage('title');
  const MSG_THEME_LABEL = chrome.i18n.getMessage('themeLabel');
  const MSG_FUNC_TYPE_LABEL = chrome.i18n.getMessage('funcTypeLabel');
  const MSG_RECENT_SIZE_LABEL = chrome.i18n.getMessage('recentSizeLabel');
  const MSG_EXCLUDE_GROUPED_TABS_LABEL = chrome.i18n.getMessage('excludeGroupedTabsLabel');

  document.getElementById('urlLabel').textContent = MSG_TITLE;
  document.getElementById('themeLabel').textContent = MSG_THEME_LABEL;
  document.getElementById('funcTypeLabel').textContent = MSG_FUNC_TYPE_LABEL;
  document.getElementById('recentSizeLabel').textContent = MSG_RECENT_SIZE_LABEL;
  document.getElementById('excludeGroupedTabsLabel').textContent = MSG_EXCLUDE_GROUPED_TABS_LABEL;

  // 获取主题
  try {
    const theme = await chrome.runtime.sendMessage({ command: 'getTheme' });
    document.body.className = theme;
  } catch (e) {}

  // 显示上次未关闭页面的URL
  initUrl();

  // 初始化主题
  initTheme();

  // 初始化选择单击图标的功能
  initFuncType();

  // 初始化最近关闭列表大小
  initRecentSize();

  // 初始化排除已分组的标签页
  initExcludeGroupedTabs();

  // 清除数据
  initClearData();
});

async function initUrl() {
  const url = document.getElementById('url');
  url.textContent = chrome.runtime.getURL(POPUP_PATH);
  url.title = chrome.i18n.getMessage('copyToClipboard');
  new ClipboardJS(url, {
    text: (trigger) => url.textContent,
  });
}

async function initTheme() {
  const theme = document.getElementById('theme');
  util.emptyElement(theme);
  for (const item of THEME_LIST) {
    const option = document.createElement('option');
    option.value = item.value;
    option.text = chrome.i18n.getMessage(item.label);
    theme.add(option);
  }
  theme.value = await options.getTheme();
  theme.addEventListener('change', async (event) => {
    await action.setTheme(event.target.value);
    await options.setTheme(event.target.value);
    document.body.className = event.target.value;
  });
}

async function initFuncType() {
  const funcType = document.getElementById('funcType');
  util.emptyElement(funcType);
  for (const item of action.FUNC_TYPE_LIST) {
    const option = document.createElement('option');
    option.value = item.value;
    option.text = item.label;
    funcType.add(option);
  }
  funcType.value = await options.getFuncType(action.DEFAULT_FUNC_TYPE.value);
  funcType.addEventListener('change', async (event) => {
    await action.setFuncType(event.target.value);
    await options.setFuncType(event.target.value);
  });
}

async function initRecentSize() {
  const recentSize = document.getElementById('recentSize');
  recentSize.value = await options.getRecentSize(action.DEFAULT_RECENT_SIZE);
  recentSize.addEventListener('change', async (event) => {
    let value = parseInt(event.target.value, 10);
    if (isNaN(value)) {
      value = action.DEFAULT_RECENT_SIZE;
    } else if (value < 1) {
      value = 1;
    } else if (value > 25) {
      value = 25;
    }
    event.target.value = value;
    await options.setRecentSize(value);
  });
}

async function initExcludeGroupedTabs() {
  const excludeGroupedTabs = document.getElementById('excludeGroupedTabs');
  util.emptyElement(excludeGroupedTabs);
  for (const item of [COMMON_YES, COMMON_NO]) {
    const option = document.createElement('option');
    option.value = item.value;
    option.text = chrome.i18n.getMessage(item.label);
    excludeGroupedTabs.add(option);
  }
  let value = await options.getExcludeGroupedTabs();
  excludeGroupedTabs.value = value ? COMMON_YES.value : COMMON_NO.value;
  excludeGroupedTabs.addEventListener('change', async (event) => {
    await options.setExcludeGroupedTabs(event.target.value === COMMON_YES.value);
  });
}

async function initClearData() {
  const clearData = document.getElementById('clearData');
  clearData.textContent = chrome.i18n.getMessage('clearData');
  clearData.addEventListener('click', async (event) => {
    await options.clear();
  });
}
