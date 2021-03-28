// https://juejin.cn/post/6917811484898623495

function curry(fn, ...rest) {
  let params = [...rest];
  function nest(...args) {
    params = [...params, ...args];
    return curry(fn, ...params);
  }

  nest.toString = function () {
    return add(...params);
  }
  return nest;
}

// 测试
function add(...args) {
  let sum = 0;
  args.forEach(item => {
    sum += item;
  });
  return sum;
}
const addCurry = curry(add, 5);
console.log(addCurry(1)(2, 4)(3)); // 15