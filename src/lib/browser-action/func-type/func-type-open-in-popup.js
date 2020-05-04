import base from '../base';
import { POPUP_PATH } from '../../constants';

const name = 'funcType_openInPopup';

async function install() {
  await base.setTitle({ title: chrome.i18n.getMessage(name) });
  await base.setPopup({ popup: chrome.runtime.getURL(POPUP_PATH) });
}

export default {
  install,
};
