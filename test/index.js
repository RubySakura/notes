// https://juejin.cn/post/6917811484898623495

function throttle(f, wait = 2000) {
  let last = 0;
  return function (...args) {
    let now = Date.now();
    if (now - last > wait) {
      f.apply(this, args);
      last = now;
    }
  };
}

window.onscroll = throttle(function () {
  console.log("this", this);
});

ip.onkeyup = throttle(function () {
  console.log("this", this);
});
