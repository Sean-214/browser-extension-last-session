import base from '../base';
import { RECENT_PATH } from '../../constants';

const name = 'funcType_recent';

async function install() {
  await base.setTitle({ title: chrome.i18n.getMessage(name) });
  await base.setPopup({ popup: chrome.runtime.getURL(RECENT_PATH) });
}

export default {
  install,
};
