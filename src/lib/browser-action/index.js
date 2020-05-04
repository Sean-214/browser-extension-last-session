import camelCase from 'lodash/camelCase';
import options from '../options';
import base from './base';
import { FUNC_TYPE_INFOS } from './func-type';
import { THEME_LIST } from '../constants';

// 自动导入模块
const _funcTypeCache = new Map();
const context = require.context('./func-type', false, /^\.\/func-type-.+\.js$/);
context.keys().forEach(fileName => {
  const component = context(fileName);
  const componentName = camelCase(fileName.replace(/^\.\/func-type-/, '').replace(/\.\w+$/, ''));
  _funcTypeCache.set(`funcType_${componentName}`, component.default || component);
});
// 主题
const _themeCache = new Map();
for (const item of THEME_LIST) {
  _themeCache.set(item.value, item);
}

/**
 * 选择单击图标的功能列表
 */
export const FUNC_TYPE_LIST = [];
for (const item of FUNC_TYPE_INFOS) {
  const funcType = _funcTypeCache.get(item.name);
  if (funcType) {
    funcType.name = item.name;
    funcType.value = item.name;
    funcType.label = chrome.i18n.getMessage(item.name);
    FUNC_TYPE_LIST.push(funcType);
  }
}

/**
 * 默认
 */
export const DEFAULT_FUNC_TYPE = FUNC_TYPE_LIST[0];

/**
 * 监听扩展程序按钮单击事件
 */
function addClickedListener() {
  chrome.browserAction.onClicked.addListener(async tab => {
    const funcType = await options.getFuncType(DEFAULT_FUNC_TYPE.value);
    const funcTypeOption = _funcTypeCache.get(funcType);
    if (funcTypeOption && typeof funcTypeOption.handle === 'function') {
      await funcTypeOption.handle(tab);
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

/**
 * 设置主题
 * @param {string} theme 主题
 */
async function setTheme(theme) {
  let _theme = theme;
  if (theme == null) {
    _theme = await options.getTheme();
  }
  const themeOption = _themeCache.get(_theme);
  if (themeOption) {
    await base.setIcon({ path: themeOption.icon });
  }
}

export default {
  FUNC_TYPE_LIST,
  DEFAULT_FUNC_TYPE,
  addClickedListener,
  setFuncType,
  setTheme,
};
