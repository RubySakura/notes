# hasOwnProperty

Object 的`hasOwnProperty()`方法返回一个布尔值，判断对象是否包含特定的自身（非继承）属性。

## 判断自身属性是否存在

```JavaScript
function Test(a) {
  this.a = a;
}
var test = new Test(0);

test.hasOwnProperty('a'); // true
test.hasOwnProperty('b'); // false
```

## 判断自身属性与继承属性

```JavaScript
function Test(a) {
  this.a = a;
}
Test.prototype.b = 1;
var test = new Test(0);

test.hasOwnProperty('a'); // true
test.hasOwnProperty('b'); // false
```

## 遍历一个对象的所有自身属性

使用`for...in`循环对象的所有枚举属性，然后再使用`hasOwnProperty()`方法来忽略继承属性。

```JavaScript
function Test(a) {
  this.a = a;
}
Test.prototype.b = 1;
var test = new Test(0);

for(let name in test) {
  if(test.hasOwnProperty(name)) {
    // 执行一些操作
  }
}
```

## 注意 hasOwnProperty 作为属性名

```JavaScript
var foo = {
    hasOwnProperty: function() {
        return false;
    },
    bar: 'Here be dragons'
};

foo.hasOwnProperty('bar'); // 始终返回 false

// 如果担心这种情况，可以直接使用原型链上真正的 hasOwnProperty 方法
// 使用另一个对象的`hasOwnProperty` 并且call
({}).hasOwnProperty.call(foo, 'bar'); // true

// 也可以使用 Object 原型上的 hasOwnProperty 属性
Object.prototype.hasOwnProperty.call(foo, 'bar'); // true
```
