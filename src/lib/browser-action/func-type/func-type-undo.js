import sessions from '../../sessions';
import base from '../base';
import util from '../../util';

const name = 'funcType_undo';

async function install() {
  await base.setTitle({ title: chrome.i18n.getMessage(name) });
  await base.setPopup({ popup: '' });
}

async function handle() {
  const sessionList = await sessions.getRecentlyClosed();
  for (const session of sessionList) {
    if (session && session.tab && session.tab.sessionId != null && !util.isInnerUrl(session.tab.url)) {
      return sessions.restore(session.tab.sessionId);
    }
  }
}

export default {
  install,
  handle,
};
