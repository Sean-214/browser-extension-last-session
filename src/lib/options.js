import storage from './storage';
import { THEME_DEFAULT } from './constants';

const OPTIONS = { options: {} };

async function getTheme() {
  const items = await storage.get(OPTIONS);
  if (items.options.theme != null) {
    return items.options.theme;
  }
  return THEME_DEFAULT.value;
}

async function setTheme(value) {
  const items = await storage.get(OPTIONS);
  items.options.theme = value;
  await storage.set(items);
  try {
    await chrome.runtime.sendMessage({ command: 'setTheme', data: value });
  } catch (e) {}
}

async function getFuncType(defaultValue) {
  const items = await storage.get(OPTIONS);
  if (items.options.funcType != null) {
    return items.options.funcType;
  }
  return defaultValue;
}

async function setFuncType(value) {
  const items = await storage.get(OPTIONS);
  items.options.funcType = value;
  await storage.set(items);
}

async function getRecentSize(defaultValue) {
  const items = await storage.get(OPTIONS);
  if (items.options.recentSize != null) {
    return items.options.recentSize;
  }
  return defaultValue;
}

async function setRecentSize(value) {
  const items = await storage.get(OPTIONS);
  items.options.recentSize = value;
  await storage.set(items);
}

async function getExcludeGroupedTabs() {
  const items = await storage.get(OPTIONS);
  if (items.options.excludeGroupedTabs != null) {
    return Boolean(items.options.excludeGroupedTabs);
  }
  return false;
}

async function setExcludeGroupedTabs(value) {
  const items = await storage.get(OPTIONS);
  items.options.excludeGroupedTabs = Boolean(value);
  await storage.set(items);
}

async function clear() {
  await storage.clear();
  try {
    await chrome.runtime.sendMessage({ command: 'clearStorage' });
  } catch (e) {}
}

export default {
  getTheme,
  setTheme,
  getFuncType,
  setFuncType,
  getRecentSize,
  setRecentSize,
  getExcludeGroupedTabs,
  setExcludeGroupedTabs,
  clear,
};
