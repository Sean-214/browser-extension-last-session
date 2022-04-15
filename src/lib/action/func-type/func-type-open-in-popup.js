import api from '../api';
import { POPUP_PATH } from '../../constants';

const name = 'funcType_openInPopup';

async function install() {
  await api.setTitle({ title: chrome.i18n.getMessage(name) });
  await api.setPopup({ popup: chrome.runtime.getURL(POPUP_PATH) });
}

export default {
  name,
  install,
};
