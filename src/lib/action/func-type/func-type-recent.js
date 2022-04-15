import api from '../api';
import { RECENT_PATH } from '../../constants';

const name = 'funcType_recent';

async function install() {
  await api.setTitle({ title: chrome.i18n.getMessage(name) });
  await api.setPopup({ popup: chrome.runtime.getURL(RECENT_PATH) });
}

export default {
  name,
  install,
};
