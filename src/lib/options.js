import storage from './storage';

const OPTIONS = { options: {} };

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

export default {
  getFuncType,
  setFuncType,
};
