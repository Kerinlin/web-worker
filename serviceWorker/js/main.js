// 判断浏览器是否支持service worker
if ('serviceWorker' in navigator) {
  console.log('当前浏览器支持serviceWorker');
  const registerServiceWorker = async () => {
    try {
      const registerWorker = await navigator.serviceWorker.register('/serviceWorker/service-worker-cache.js', { scope: '/serviceWorker/' })
      console.log('service worker 注册成功', registerWorker);
    } catch (error) {
      console.log('service worker注册失败', error);
    }
  }
  registerServiceWorker();
}