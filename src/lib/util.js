function emptyElement(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

function getBase64ByUrl(url, width, height) {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.src = url;
    img.crossOrigin = '';
    img.onload = () => {
      resolve(_imgToDataURL(img, width, height));
    };
  });
}

function _imgToDataURL(img, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width || img.width;
  canvas.height = height || img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL();
}

export default {
  emptyElement,
  getBase64ByUrl,
};
