Function.prototype.myBind = function (oThis) {
  if (typeof this !== "function") {
    // closest thing possible to the ECMAScript 5
    // internal IsCallable function
    throw new TypeError(
      "Function.prototype.bind - what is trying to be bound is not callable"
    );
  }
  var aArgs = Array.prototype.slice.call(arguments, 1),
    fToBind = this,
    // 空函数
    fNOP = function () {},
    fBound = function () {
      return fToBind.apply(
        this instanceof fNOP ? this : oThis,
        // 获取调用时(fBound)的传参.bind 返回的函数入参往往是这么传递的
        aArgs.concat(Array.prototype.slice.call(arguments))
      );
    };
  // 维护原型关系
  if (this.prototype) {
    // Function.prototype doesn't have a prototype property
    fNOP.prototype = this.prototype;
  }
  fBound.prototype = new fNOP();
  return fBound;
};

function foo(name) {
  this.name = name;
}
var obj = {};
var bar = foo.myBind(obj);
bar("Jack");
console.log(obj.name); // Jack

console.log("bar", bar.prototype);

var alice = new bar("Alice");
console.log(obj.name); // Alice
console.log(alice.name); // undefined

// 为什么要判断this.prototype，这是因为bind方法返回的函数和箭头函数都是没有prototype的
