// 设置缓存名称
const cacheName = 'v1'

// 缓存的内容
const cacheList = [
  '/serviceWorker/',
  '/serviceWorker/index.html',
  '/serviceWorker/js/main.js',
  '/serviceWorker/css/index.css',
  '/serviceWorker/img/notUseWorker.gif',
  '/serviceWorker/img/useWorker.gif',
]

// 将缓存的资源加进cache storage
const addResourcesToCache = async (resources) => {
  const cache = await caches.open(cacheName);
  await cache.addAll(resources);
  self.skipWaiting()
}

// 将请求的资源加进缓存
const putInCache = async (request, response) => {
  const cache = await caches.open(cacheName);
  await cache.put(request, response)
}

// 打开预加载navigition,清除旧缓存
const cleanOldCache = async () => {
  try {
    const cacheNameList = await caches.keys();
    console.log('旧缓存', cacheNameList);
    Promise.all(cacheNameList.map(cacheItem => {
      console.log('cacheItem', cacheItem);
      // 只保留当前cacheName的缓存
      if (cacheItem !== cacheName) {
        console.log('清除缓存', cacheItem);
        return caches.delete(cacheItem);
      }
    }))
  } catch (error) {
    console.log('清缓存报错', error);
  }
}

// 处理网络请求,优先读取缓存
const handleFetch = async (e) => {
  try {
    // 检查之前是否存在缓存
    const responsFromCache = await caches.match(e.request);
    if (responsFromCache) {
      return responsFromCache;
    }

    // https://web.dev/navigation-preload/#header
    // 预加载的navigation,减少启动service worker带来的请求延迟，现在请求可以与启动service worker并行，这里如果存在预加载的请求，将其放入缓存
    if (e.preloadResponse) {
      putInCache(e.request, e.preloadResponse.clone());
      return e.preloadResponse;
    }

    // 没有缓存直接请求
    const resultFromNet = await fetch(e.request);
    putInCache(e.request, resultFromNet.clone());
    return resultFromNet;
  } catch (error) {
    // return caches.match(request);
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

self.oninstall = (e) => {
  console.log('service worker 已安装', e);
  e.waitUntil(
    addResourcesToCache(cacheList)
  )
}
self.onactivate = (e) => {
  console.log('service worker 已激活', e);
  e.waitUntil(async function () {
    if (self.registration.navigationPreload) {
      // Enable navigation preloads!
      await self.registration.navigationPreload.enable();
    }
    await cleanOldCache()
  }())
}

self.onfetch = (e) => {
  console.log('service worker fetching');
  e.respondWith(handleFetch(e))
}