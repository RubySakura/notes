# instanceof Number

有一个问题，问每行代码的返回值是什么，具体代码如下：

```JavaScript
123 instanceof Number
Number(123) instanceof Number
new Number(123) instanceof Number
```

结果如下：

```JavaScript
false
false
true
```

想要知道原因，首先明确一点，instanceof 的作用是什么：

**instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。**

语法为：

```
object instanceof constructor
```

具体来说，instanceof 运算符用来检测 constructor.prototype 是否存在于参数 object 的原型链上。也就是说，instanceof 左侧 object 是某个实例对象，右侧为某个构造函数。**并且 instanceof 运算符不会对左侧进行自动装箱。**

所以回过头来看，无论是 `123`还是`Number(123)`，都是基本类型中的数字类型，只有`new Number(123)`才是Number类型的实例，所以只有`new Number(123) instanceof Number`的结果为true。

以下例子同理：

```JavaScript
"nihao" instanceof String; // false
String("nihao") instanceof String; // false
new String("nihao") instanceof String; // true

false instanceof Boolean; // false
Boolean(false) instanceof Boolean; // false
new Boolean(false) instanceof Boolean; // true
```

## 参考文章
- [instanceof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof)
- [js 中 instanceof number](https://blog.csdn.net/pb_watercuizhen/article/details/84827711)