function myNew() {
  // 首先将参数变换为数组，并取出第0项，即构造函数
  const args = [...arguments];
  const Constructor = args.shift();
  // 首先生成一个空白对象
  const obj = {};
  // 然后将原型链确定
  obj.__proto__ = Constructor.prototype;
  const ret = Constructor.apply(obj, args);
  if (typeof ret === "object") {
    return ret;
  } else {
    return obj;
  }
}

const Fun = function (name) {
  this.name = name;
};
Fun.prototype.getName = function () {
  alert(this.name);
};
let fun = myNew(Fun, "gim");
fun.getName(); // gim

// https://juejin.cn/post/6917811484898623495
