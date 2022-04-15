function emptyElement(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

function isInnerUrl(url) {
  return url && url.startsWith(chrome.runtime.getURL(''));
}

function getBase64ByUrl(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(new Request(url));
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result));
      reader.addEventListener('error', () => resolve(null));
      reader.readAsDataURL(await res.blob());
    } catch (err) {
      resolve(null);
    }
  });
}

function compareVersion(v1, v2) {
  const v1Arr = v1.split('.');
  const v2Arr = v2.split('.');
  for (let i = 0; i < 3; i++) {
    v1Arr[i] = parseInt(v1Arr[i], 10) || 0;
    v2Arr[i] = parseInt(v2Arr[i], 10) || 0;
    if (v1Arr[i] != v2Arr[i]) {
      return v1Arr[i] - v2Arr[i];
    }
  }
  return 0;
}

export default {
  emptyElement,
  isInnerUrl,
  getBase64ByUrl,
  compareVersion,
};
