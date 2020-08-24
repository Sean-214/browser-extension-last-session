import { FUNC_TYPE_LIST } from './browser-action';

function getAll() {
  return new Promise((resolve, reject) => {
    chrome.commands.getAll(resolve);
  });
}

/**
 * 监听快捷键激活命令事件
 */
function addCommandListener() {
  chrome.commands.onCommand.addListener(async command => {
    const funcTypeOption = FUNC_TYPE_LIST.find(item => command === item.name);
    if (funcTypeOption && typeof funcTypeOption.handle === 'function') {
      await funcTypeOption.handle();
    }
  });
}

export default {
  getAll,
  addCommandListener,
};
