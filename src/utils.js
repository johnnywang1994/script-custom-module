export function insertBefore(target, el) {
  target.insertAdjacentElement('beforebegin', el);
}

export function insertAfter(target, el) {
  target.insertAdjacentElement('afterend', el);
}

export function loadContent(url) {
  const request = new XMLHttpRequest();
  request.open('GET', url, false); // `false` makes the request synchronous
  request.send(null);

  if(request.status === 200) {
    return request.responseText;
  }
  throw new Error(request.statusText);
}

export function createBlob(code, type = 'text/plain') {
  const blob = new Blob([code], { type });
  return URL.createObjectURL(blob);
}

// modify from koa-compose
export function loaderCompose(loaders) {
  return function(context, options) {
    let index = -1;
    return dispatch(0);

    async function dispatch(i) {
      if (i <= index) return Promise.reject(new Error('called multiple times'));
      index = i;
      let fn = loaders[i];
      if (!fn) return Promise.resolve();
      try {
        context.code = await Promise.resolve(fn(context, options));
        return dispatch.call(null, i + 1)
      } catch (err) {
        return Promise.reject(err);
      }
    }
  }
}
