let count = 0;
function checkNullObj(obj) {
  return Object.keys(obj).length === 0
}
self.onmessage = (e) => {
  console.log('接收到主线程发来的消息', e.data);
  let action = e.data;
  if (!checkNullObj(action)) {
    let mapAction = {
      add: () => {
        count += action.data;
      },
      sub: () => {
        count -= action.data;
      },
      multi: () => {
        count *= action.data;
      },
      div: () => {
        count /= action.data;
      },
      clear: () => {
        count = 0;
      },
      getResult: () => {
        console.log('获取当前count', count);
      }
    }
    mapAction[action.type]();

    // 分发计算结果
    let resultSend = ['add', 'sub', 'multi', 'div', 'clear', 'getResult'];
    if (resultSend.includes(action.type)) {
      self.postMessage({ type: 'result', data: count });
    }
  }
}
