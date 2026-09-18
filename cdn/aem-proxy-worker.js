const ORIGIN_HOSTNAME = 'main--strawberry-aviation-aem--4j4yk.aem.live';
const CACHE_VERSION = 'aem-grounded-assistant-2026-09-18-1';

function extension(pathname) {
  const basename = pathname.split('/').pop();
  const position = basename.lastIndexOf('.');
  return !basename || position < 1 ? '' : basename.slice(position + 1);
}

function isMedia(url) {
  return /\/media_[0-9a-f]{40,}[/a-zA-Z0-9_-]*\.[0-9a-z]+$/.test(url.pathname);
}

function retainSearchParameters(url, allowed) {
  [...url.searchParams.keys()]
    .filter((key) => !allowed.includes(key))
    .forEach((key) => url.searchParams.delete(key));
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/drafts/')) return new Response('Not Found', { status: 404 });

    const savedSearch = url.search;
    const mediaRequest = isMedia(url);
    if (mediaRequest) {
      retainSearchParameters(url, ['format', 'height', 'optimize', 'width']);
    } else if (extension(url.pathname) === 'json') {
      retainSearchParameters(url, ['limit', 'offset', 'sheet']);
    } else {
      url.search = '';
    }
    url.searchParams.sort();
    url.hostname = ORIGIN_HOSTNAME;
    if (!mediaRequest) url.searchParams.set('__release', CACHE_VERSION);
    const cacheUrl = new URL(url);

    const originRequest = new Request(url, request);
    originRequest.headers.set('x-forwarded-host', 'aviation.ajayk.xyz');
    originRequest.headers.set('x-byo-cdn-type', 'cloudflare');
    originRequest.headers.set('x-push-invalidation', 'enabled');

    let response = await fetch(originRequest, {
      method: request.method,
      cf: { cacheEverything: true, cacheKey: cacheUrl.href },
    });
    response = new Response(response.body, response);
    if (response.status === 301 && savedSearch) {
      const location = response.headers.get('location');
      if (location && !location.includes('?')) response.headers.set('location', `${location}${savedSearch}`);
    }
    if (response.status === 304) response.headers.delete('content-security-policy');
    response.headers.delete('age');
    response.headers.delete('x-robots-tag');
    return response;
  },
};
