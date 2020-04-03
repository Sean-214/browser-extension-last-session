import options from '../options';
import base from './base';

// 自动导入模块
const _funcTypeCache = new Map();
const context = require.context('./func-type', false, /.+\.js$/);
context.keys().forEach(fileName => {
  let component = context(fileName);
  component = component.default || component;
  const funcTypeOption = { ...component };
  _funcTypeCache.set(funcTypeOption.value, funcTypeOption);
});

/**
 * 选择单击图标的功能列表
 */
const FUNC_TYPE_LIST = [..._funcTypeCache.values()].sort((a, b) => {
  if (a.order < b.order) {
    return -1;
  }
  return 1;
});

/**
 * 默认
 */
const DEFAULT_FUNC_TYPE = FUNC_TYPE_LIST[0];

/**
 * 监听扩展程序按钮单击事件
 */
function addClickedListener() {
  chrome.browserAction.onClicked.addListener(async tab => {
    const funcType = await options.getFuncType(DEFAULT_FUNC_TYPE.value);
    const funcTypeOption = _funcTypeCache.get(funcType);
    if (funcTypeOption && typeof funcTypeOption.handle === 'function') {
      funcTypeOption.handle(tab);
    }
  });
}

/**
 * 设置单击扩展程序按钮的功能
 * @param {string} type 功能类型
 */
async function setFuncType(type) {
  let _type = type;
  if (type == null) {
    _type = await options.getFuncType(DEFAULT_FUNC_TYPE.value);
  }
  const funcTypeOption = _funcTypeCache.get(_type);
  if (funcTypeOption && typeof funcTypeOption.install === 'function') {
    await funcTypeOption.install();
  }
}

const { setTitle, setPopup } = base;

export default {
  FUNC_TYPE_LIST,
  DEFAULT_FUNC_TYPE,
  setTitle,
  setPopup,
  addClickedListener,
  setFuncType,
};
