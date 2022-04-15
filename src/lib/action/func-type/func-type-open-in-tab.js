import tabs from '../../tabs';
import api from '../api';
import { POPUP_PATH } from '../../constants';

const name = 'funcType_openInTab';

async function install() {
  await api.setTitle({ title: chrome.i18n.getMessage(name) });
  await api.setPopup({ popup: '' });
}

async function handle(tab) {
  await tabs.active(chrome.runtime.getURL(POPUP_PATH));
}

export default {
  name,
  install,
  handle,
};
