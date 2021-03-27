// https://juejin.cn/post/6917811484898623495

Function.prototype.myBind = function (bindThis, ...bindArgs) {
  // 如果bind的调用者不是function类型，抛出异常
  if (typeof this !== "function") {
    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
  }
  // 定义一个中间空函数，作为继承的中转
  const fNop = function () { }
  // 为什么不直接使用调用者this，是为了防止参数传递导致的问题
  fNop.prototype = this.prototype;

  // 固化this到fToBind，使其指向myBind方法的调用者
  const fToBind = this;
  // 定义之后要返回的函数
  const fBound = function (...args) {
    // 合并bind方法预置的参数和执行时的参数
    const totalArgs = [...bindArgs, ...args];
    // 如果this在fNop的原型链上,那么证明是用new调用的,无视bindThis
    const finalThis = this instanceof fNop ? this : bindThis;
    // 注意除了执行,要return出去
    return fToBind.apply(finalThis, totalArgs);
  }

  // 将返回函数作为调用者的子类
  fBound.prototype = new fNop();

  // 返回该函数
  return fBound;
}

function Person(oname, osex) {
  this.oname = oname;
  this.osex = osex;
  return {a: 1};
}

Person.prototype.intro = function() {
  console.log(`my name is ${this.oname}, i am ${this.osex}`)
}

const obj = {};

const boundFun = Person.myBind(obj, "lijian");

const person = new boundFun("male");
console.log(obj);
console.log(person);
