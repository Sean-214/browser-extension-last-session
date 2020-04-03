import tabs from '../../tabs';
import base from '../base';
import { POPUP_PATH } from '../../constants';

const name = 'funcTypeLabel_2';
const label = chrome.i18n.getMessage(name);
const value = name;
const order = 2;

async function install() {
  await base.setTitle({ title: chrome.i18n.getMessage(name) });
  await base.setPopup({ popup: '' });
}

async function handle(tab) {
  const windowId = tab.windowId;
  const url = chrome.runtime.getURL(POPUP_PATH);
  const tabList = await tabs.query({ windowId });
  if (tabList && tabList.length) {
    const tabItem = tabList.find(item => item.url && item.url.startsWith(url));
    if (tabItem) {
      await tabs.update(tabItem.id, { active: true });
      return;
    }
  }
  await tabs.create({ url });
}

export default {
  name,
  label,
  value,
  order,
  install,
  handle,
};
