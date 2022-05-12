import options from '../options';
import api from './api';
import { FUNC_TYPE_INFOS } from './func-type';
import { THEME_LIST } from '../constants';

// 自动导入模块
const _funcTypeCache = new Map();
const context = require.context('./func-type', false, /^\.\/func-type-.+\.js$/);
context.keys().forEach((fileName) => {
  let component = context(fileName);
  component = component.default || component;
  _funcTypeCache.set(component.name, component);
});
// 主题
const _themeCache = new Map();
for (const item of THEME_LIST) {
  _themeCache.set(item.value, item);
}

/**
 * 获取功能类型模块
 * @param {String} name 功能类型名称
 * @returns 功能类型模块
 */
export function getFuncTypeComponent(name) {
  return _funcTypeCache.get(name);
}

/**
 * 选择单击图标的功能列表
 */
export const FUNC_TYPE_LIST = [];
for (const item of FUNC_TYPE_INFOS) {
  const funcType = _funcTypeCache.get(item.name);
  if (funcType) {
    const value = item.name;
    const label = chrome.i18n.getMessage(item.name);
    FUNC_TYPE_LIST.push({ value, label });
  }
}

/**
 * 默认单击图标的功能
 */
export const DEFAULT_FUNC_TYPE = FUNC_TYPE_LIST[0];

/**
 * 默认最近关闭列表大小
 */
export const DEFAULT_RECENT_SIZE = 20;

/**
 * 监听扩展程序按钮单击事件
 */
function addClickedListener() {
  api.addClickedListener(async (tab) => {
    const funcType = await options.getFuncType(DEFAULT_FUNC_TYPE.value);
    const funcTypeOption = _funcTypeCache.get(funcType);
    if (funcTypeOption && typeof funcTypeOption.handle === 'function') {
      await funcTypeOption.handle(tab);
    }
  });
}

/**
 * 设置单击扩展程序按钮的功能
 * @param {Object} funcType 功能类型
 */
async function setFuncType(funcType) {
  let _funcType = funcType;
  if (funcType == null) {
    _funcType = await options.getFuncType(DEFAULT_FUNC_TYPE.value);
  }
  const funcTypeOption = _funcTypeCache.get(_funcType);
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
    await api.setIcon({ path: themeOption.icon });
  }
}

export default {
  FUNC_TYPE_LIST,
  DEFAULT_FUNC_TYPE,
  DEFAULT_RECENT_SIZE,
  addClickedListener,
  setFuncType,
  setTheme,
};
