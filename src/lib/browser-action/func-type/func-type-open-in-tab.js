import tabs from '../../tabs';
import base from '../base';
import { POPUP_PATH } from '../../constants';

const name = 'funcType_openInTab';

async function install() {
  await base.setTitle({ title: chrome.i18n.getMessage(name) });
  await base.setPopup({ popup: '' });
}

async function handle(tab) {
  const windowId = tab ? tab.windowId : null;
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
  install,
  handle,
};
