# JavaScript知识点

## 函数的生命周期
- 创建：JS解析引擎进行预解析，会将函数声明提前，同时将该函数放到全局作用域中或当前函数的上一级函数的局部作用域中。
- 执行：JS引擎会将当前函数的局部变量和内部函数进行声明提前，然后再执行业务代码，当函数执行完退出时，释放该函数的执行上下文，并注销该函数的局部变量。

## 变量和函数的声明顺序
如果变量名和函数名声明时相同，函数优先声明。

## Activetion Object（AO）、Variable Object（VO）：

- AO：Activetion Object（活动对象）
- VO：Variable Object（变量对象）

VO对应的是函数创建阶段，JS解析引擎进行预解析时，所有的变量和函数的声明，统称为Variable Object。该变量与执行上下文相关，知道自己的数据存储在哪里，并且知道如何访问。VO是一个与执行上下文相关的特殊对象，它存储着在上下文中声明的以下内容：

- 变量 (var, 变量声明);
- 函数声明 (FunctionDeclaration, 缩写为FD);
- 函数的形参

AO对应的是函数执行阶段，当函数被调用执行时，会建立一个执行上下文，该执行上下文包含了函数所需的所有变量，该变量共同组成了一个新的对象就是Activetion Object。该对象包含了：

- 函数的所有局部变量
- 函数的所有命名参数
- 函数的参数集合
- 函数的this指向

## 作用域链

当代码在一个环境中创建时，会创建变量对象的一个作用域链（scope chain）来保证对执行环境有权访问的变量和函数。作用域第一个对象始终是当前执行代码所在环境的变量对象（VO）。如果是函数执行阶段，那么将其activation object（AO）作为作用域链第一个对象，第二个对象是上级函数的执行上下文AO，下一个对象依次类推。

当查找变量的时候，会先从当前上下文的变量对象中查找，如果没有找到，就会从父级(词法层面上的父级)执行上下文的变量对象中查找，一直找到全局上下文的变量对象，也就是全局对象。这样由多个执行上下文的变量对象构成的链表就叫做作用域链。

## null和undefined
null：Null类型，代表 “空值”，代表一个空对象指针，使用typeof运算得到 “object” ，所以可以认为它是一个特殊的对象值。

undefined：Undefined类型，当一个声明了一个变量未初始化时，得到的就是 undefined。


null 和 undefined 转换为布尔值均为false（在if内也会自动转换）
```JavaScript
!!null // false
!!undefined // false
```

null 和 undefined 转换为数字（也可以和数字进行运算）
```JavaScript
Number(null) // 0
Number(undefined) // NaN
```

null 和 undefined 的相等判断
```JavaScript
null == undefined // true
null === undefined // false
```

## null和undefined的用法区别
null是javascript的关键字，可以认为是对象类型，它是一个空对象指针，和其他语言一样都代表“空值”，undefine却是javascript才有的，为了区分指针对象和未初始化的变量，它是一个预定义的全局变量。没有返回值的函数返回为undefined，没有实参的形参也是undefined。

null 和 undefined 都表示 “值的空缺”，可以认为 undefined 是表示系统级的、出乎意料的或类似错误的值的空缺，而null是表示程序级的、正常的或在意料之中的值的空缺。

null表示"没有对象"，即该处不应该有值。典型用法是：
- 作为函数的参数，表示该函数的参数不是对象。
- 作为对象原型链的终点。

```JavaScript
Object.getPrototypeOf(Object.prototype) // null
```

undefined表示"缺少值"，就是此处应该有一个值，但是还没有定义。典型用法是：
- 变量被声明了，但没有赋值时，就等于undefined。
- 调用函数时，应该提供的参数没有提供，该参数等于undefined。
- 对象没有赋值的属性，该属性的值为undefined。
- 函数没有返回值时，默认返回undefined。


