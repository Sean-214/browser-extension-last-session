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
  chrome.runtime.sendMessage({ command: 'setTheme', data: value });
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

async function clear() {
  await storage.clear();
  chrome.runtime.sendMessage({ command: 'clearStorage' });
}

export default {
  getTheme,
  setTheme,
  getFuncType,
  setFuncType,
  clear,
};
