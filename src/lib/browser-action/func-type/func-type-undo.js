import sessions from '../../sessions';
import base from '../base';
import { POPUP_PATH } from '../../constants';

const name = 'funcType_undo';

async function install() {
  await base.setTitle({ title: chrome.i18n.getMessage(name) });
  await base.setPopup({ popup: '' });
}

async function handle() {
  const url = chrome.runtime.getURL(POPUP_PATH);
  const sessionList = await sessions.getRecentlyClosed();
  for (const session of sessionList) {
    if (session && session.tab && session.tab.sessionId != null && session.tab.url !== url) {
      return sessions.restore(session.tab.sessionId);
    }
  }
}

export default {
  install,
  handle,
};
