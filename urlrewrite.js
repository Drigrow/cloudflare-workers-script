addEventListener('fetch', event => {
  event.passThroughOnException(); // 在发生异常时传递请求
  event.respondWith(handleRequest(event.request));
});
addEventListener('fetch', event => {
  event.passThroughOnException(); // 在发生异常时传递请求
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  try {
    let url = new URL(request.url);

    // 检查请求路径，如果是redirect.php页面，则直接返回fetch结果
    if (url.pathname.endsWith('/redirect.php')) {
      return fetch(request);
    }

    if (!url.pathname.includes('.') && !url.pathname.endsWith('/')) {
      let htmlUrl = new URL(url);
      htmlUrl.pathname += '.html';
      let htmlResponse = await fetch(htmlUrl.toString(), request);
      if (htmlResponse.status === 404) {
        let phpUrl = new URL(url);
        phpUrl.pathname += '.php';
        return fetch(phpUrl.toString(), request);
      }
      return htmlResponse;
    }
    return fetch(request);
  } catch (error) {
    // 在发生异常时重定向到exception.html
    return Response.redirect('/exception.html', 302);
  }
}


