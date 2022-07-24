function calculate() {
  let sum = 0;
  for (let i = 0; i < 10000000000; i++) {
    sum += i;
  }
  return sum;
}
self.onmessage = (e) => {
  let action = e.data;
  if (action === 'calculateSum') {
    let sum = calculate();
    self.postMessage({ type: 'result', sum })
  }
}