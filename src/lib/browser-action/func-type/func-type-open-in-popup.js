import base from '../base';
import { POPUP_PATH } from '../../constants';

const name = 'funcTypeLabel_3';
const label = chrome.i18n.getMessage(name);
const value = name;
const order = 3;

async function install() {
  await base.setTitle({ title: chrome.i18n.getMessage(name) });
  await base.setPopup({ popup: chrome.runtime.getURL(POPUP_PATH) });
}

export default {
  name,
  label,
  value,
  order,
  install,
};
