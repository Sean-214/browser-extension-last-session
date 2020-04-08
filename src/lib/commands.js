import { FUNC_TYPE_LIST } from './browser-action';

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
  addCommandListener,
};
