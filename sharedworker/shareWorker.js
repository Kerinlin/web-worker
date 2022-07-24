let portList = [];
let count = 0;
function checkNullObj(obj) {
  return Object.keys(obj).length === 0
}
self.onconnect = (e) => {
  const port = e.ports?.[0];
  portList.push(port);
  port.onmessage = (e) => {
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
        closePort: () => {
          console.log('关闭端口', portList);
          if (portList.indexOf(port) > -1) {
            port.close();
            portList.splice(portList.indexOf(port), 1);
            console.log('删除后', portList);
          }
        },
        getResult: () => {
          console.log('获取当前count',count);
        }
      }
      mapAction[action.type]();

      // 分发计算结果
      let resultSend = ['add', 'sub', 'multi', 'div', 'clear','getResult'];
      if (resultSend.includes(action.type)) {
        console.log('分发的端口', portList);
        portList.forEach(item => {
          item.postMessage({ type: 'result', data: count });
        })
      }
    }
  }
}