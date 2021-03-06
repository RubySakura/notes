# 手写new

## new的时候发生了什么？
想要知道如何手写new，那就先要知道new的时候发生了什么。

1. 生成一个空白对象，也就是最终要返回的实例，并将this指向这个实例。
2. 将实例的 `__proto__` 属性指向构造函数的原型属性 `prototype` ，使得实例有正确的原型链。
3. 执行构造函数，因为此时this指向之前生成的实例，所以构造函数内通过this绑定的属性，都会绑定到该实例上。
4. 判断执行构造函数的返回值，如果返回值存在且类型为对象，那么直接返回该返回值，其他情况下返回第一步中生成的实例。

## 手写new
知道了new的时候发生了什么，下面开始手写new：

```JavaScript
function myNew(Constructor, ...args) {
  // 首先生成一个空白对象，也就是最终要返回的实例
  const obj = {};
  // 使得实例有正确的原型链
  obj.__proto__ = Constructor.prototype;
  // 在将this绑定到实例的情况下执行构造函数
  const ret = Constructor.apply(obj, args);
  // 判断构造函数的返回值是否是对象
  if (typeof ret === "object") {
    // 是则直接返回
    return ret;
  } else {
    // 否则返回之前生成的实例
    return obj;
  }
}

// 测试
const Fun = function (name) {
  this.name = name;
};
Fun.prototype.getName = function () {
  alert(this.name);
};
let fun = myNew(Fun, "gim");
fun.getName(); // gim
```

## 拓展

来自于美团面试官提出的问题，现在有一个构造函数，希望无论是否使用new的情况下，都可以正确的生成实例，如何实现？

这个问题的关键点在于，一个函数，既可以作为构造函数，也可以作为普通函数，都是可以执行的，区别在于执行该函数，构造实例的时候，this指向要返回的实例上，正常执行时，this指向执行者。

那么突破点在于this的指向，所以我们找到了关键点，即 `this.__proto__` 是否等于构造函数的prototype，如果是，那么目前使用了new。但是我们还要考虑到继承的情况，所以更加完善的方法是，判断this 是否 instanceof 构造函数，如果是，那么目前使用了new。

具体代码如下：

```JavaScript
function Person(name, sex) {
  if(this instanceof Person) {
    // 如果true，也就是this在Person的原型链上，那么证明this是Person或者Person的子类通过new执行的
    // 此时正常使用即可
    this.name = name;
    this.sex = sex;
  } else {
    // 如果false，证明不是通过new，那么通过new执行，进入true分支
    return new Person(name, sex);
  }
}

Person.prototype.introduce = function() {
  console.log(`我是${this.name}，是个${this.sex}。`);
}
// 以下是测试

// 测试用例1，证明该构造函数Person无论是否使用new的情况下，都可以正确的生成实例

Person("jian", "male").introduce(); // 我是jian，是个male。
new Person("jian", "male").introduce(); // 我是jian，是个male。

// 测试用例2，声明了Person的子类Teacher，证明该构造函数Person也可以正确的用于继承

function Teacher(name, sex, subject) {
  Person.call(this, name, sex);
  this.subject = subject;
}
Teacher.prototype = Object.create(Person.prototype);
Teacher.prototype.constructor = Teacher;

Teacher.prototype.teach = function() {
  console.log(`我是${this.name}，是个${this.sex}，负责的科目是${this.subject}。`);
}

new Teacher("jian", "male", "math").introduce(); // 我是jian，是个male。
new Teacher("jian", "male", "math").teach(); // 我是jian，是个male，负责的科目是math。
```

还有一种方法另辟蹊径，利用了构造函数的返回值存在且类型为对象的情况下直接返回这个返回值这一特性，直接在内部生成对象并返回，这样无论是否使用new，都会返回对应的实例。具体代码如下：

```JavaScript
function Person(name, sex) {
  var obj = Object.create(Person.prototype); //手工指定原型
  obj.name = name;
  obj.sex = sex;
  return obj;
}

Person.prototype.introduce = function () {
  console.log(`我是${this.name}，是个${this.sex}。`);
}
// 以下是测试
Person("jian", "male").introduce();
new Person("jian", "male").introduce();
```

但是这种方面存在一个很明显的缺陷，就是无法实现继承了，所以我更倾向于第一种方法。

## 参考文章
- [几个面试常见手写代码](https://juejin.cn/post/6917811484898623495)
- [构造函数忘记new? 看这里看这里](https://www.cnblogs.com/redking-fighting/p/6242595.html)