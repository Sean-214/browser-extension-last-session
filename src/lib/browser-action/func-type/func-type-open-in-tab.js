import tabs from '../../tabs';
import base from '../base';
import { POPUP_PATH } from '../../constants';

const name = 'funcType_openInTab';

async function install() {
  await base.setTitle({ title: chrome.i18n.getMessage(name) });
  await base.setPopup({ popup: '' });
}

async function handle(tab) {
  await tabs.active(chrome.runtime.getURL(POPUP_PATH));
}

export default {
  install,
  handle,
};
