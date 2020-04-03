import ClipboardJS from 'clipboard';
import browserAction from '../lib/browser-action';
import options from '../lib/options';
import util from '../lib/util';
import { POPUP_PATH } from '../lib/constants';
import './options.scss';

document.addEventListener('DOMContentLoaded', async () => {
  // 国际化
  const MSG_TITLE = chrome.i18n.getMessage('title');
  const MSG_COPY_TO_CLIPBOARD = chrome.i18n.getMessage('copyToClipboard');
  const MSG_FUNC_TYPE_LABEL = chrome.i18n.getMessage('funcTypeLabel');

  document.getElementById('urlLabel').textContent = MSG_TITLE;
  document.getElementById('funcTypeLabel').textContent = MSG_FUNC_TYPE_LABEL;

  // 显示上次未关闭页面的URL
  const url = document.getElementById('url');
  url.textContent = chrome.runtime.getURL(POPUP_PATH);
  url.title = MSG_COPY_TO_CLIPBOARD;
  new ClipboardJS(url, {
    text: trigger => url.textContent,
  });

  // 初始化表单
  const funcType = document.getElementById('funcType');
  util.emptyElement(funcType);
  for (const item of browserAction.FUNC_TYPE_LIST) {
    const option = document.createElement('option');
    option.value = item.value;
    option.text = item.label;
    funcType.add(option);
  }
  funcType.value = await options.getFuncType(browserAction.DEFAULT_FUNC_TYPE.value);
  funcType.addEventListener('change', async () => {
    const funcType = document.getElementById('funcType');
    await browserAction.setFuncType(funcType.value);
    await options.setFuncType(funcType.value);
  });
});
