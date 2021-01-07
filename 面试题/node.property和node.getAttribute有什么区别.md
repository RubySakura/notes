# node.property和node.getAttribute有什么区别

`node.getAttribute('someAttribute')`获取的是`attribute`，而`node.someAttribute`获取的是元素的`property`，二者并不相同。

在大多数情况下「property」和「attribute」是同步的，如下情况 1：

## 情况1

```HTML
<input id="username" type="text">
<script>
var userInput = document.querySelector('#username');
console.log( userInput.id );                  //"username"
console.log( userInput.getAttribute('id') );  //"username"
</script>
```

但是在如下情况 2 中，两者就产生了区别：

## 情况2

```HTML
<input id="username" type="text" sex="male" age=26>
<script>
var userInput = document.querySelector('#username');
console.log( userInput.sex );                  // undefined
console.log( userInput.getAttribute('sex') );  // "male"
console.log( userInput.getAttribute('SEX') );  // "male"
console.log( userInput.getAttribute('age'));   // "26"
</script>
```
由情况2可知：
- `node.property`的方式不能获取自定义属性，`node.getAttribute()`的方式可以获取自定义属性
- `node. getAttribute()`获取自定义属性忽略属性的大小写
- `node.getAttribute()`获取自定义属性得到的值的类型总是字符串

## 情况3

```HTML
<button id="btn" disabled>点我</button>
<script>
var btn = document.querySelector('#btn');
console.log( btn.disabled );                  // true
console.log( btn.getAttribute('disabled') );  // ""
</script>
```

```HTML
<button id="btn" disabled=false>点我</button>
<script>
var btn = document.querySelector('#btn');
console.log( btn.disabled );                  // true
console.log( btn.getAttribute('disabled') );  // "false"
</script>
```

对于上面的例子，HTML中只要出现了disabled 属性，不管值是什么，对于 DOM property结果都是true， 而对于 attribute 获取的则是把 HTML 里对应属性的值拿到转换成字符串。

**input 标签的 checked 也有类似的特性。**

此处可以延申一下，除了获取之外，给DOM property赋值和 setAttribute有什么区别呢：

### 情况3-1
```HTML
<button id="btn" disabled>点我</button>
<script>
var btn = document.querySelector('#btn');
btn.disabled = false;
</script>
```
```HTML
<button id="btn" disabled>点我</button>
<script>
var btn = document.querySelector('#btn');
btn.setAttribute("disabled", false);
</script>
```
给DOM property赋值生效了，而setAttribute并没有生效。

再延申一下：
### 情况3-2
```HTML
<input type="checkbox" name="" id="checkbox">
<script>
var checkbox = document.querySelector('#checkbox');
checkbox.checked = true;
</script>
```
```HTML
<input type="checkbox" name="" id="checkbox">
<script>
var checkbox = document.querySelector('#checkbox');
checkbox.setAttribute("checked", true);
</script>
```
这时候我们发现，DOM property和setAttribute都生效了，但是其实这只是因为，checked和disabled类似，只要出现该属性，无论是checked、checked=""、checked="true"、checked="false"，都相当于制定了checked，而setAttribute在这个HTML元素没有checked属性的时候新增了这个属性，所以此次执行成功了，但是如果再执行一次，会发现该checkbox的checked状态不变，执行失败，如下：
```HTML
<input type="checkbox" name="" id="checkbox">
<script>
var checkbox = document.querySelector('#checkbox');
var checkbox = document.querySelector('#checkbox');
var bool = true;
setInterval(()=> {
    checkbox.setAttribute("checked", bool = !bool);
},1000);
</script>
```
可以看到，该checkbox的checked状态只变了一次，就不再改变了。

同理radio和select：
### 情况3-3
radio设置成功：
```HTML
<input type="radio" name="sex" value="male">
<input type="radio" name="sex" value="female" checked>
<script>
var male = document.querySelector('input[type="radio"][value="male"]');
var female = document.querySelector('input[type="radio"][value="female"]');
female.checked = false;
</script>
```
radio设置失败：
```HTML
<input type="radio" name="sex" value="male">
<input type="radio" name="sex" value="female" checked>
<script>
var male = document.querySelector('input[type="radio"][value="male"]');
var female = document.querySelector('input[type="radio"][value="female"]');
female.setAttribute("checked", false);
</script>
```
select设置成功：
```HTML
<select name="" id="select">
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
</select>
<script>
var select = document.querySelector('#select');
select.value = 2;
</script>
```
select设置失败：
```HTML
<select name="" id="select">
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
</select>
<script>
var select = document.querySelector('#select');
select.setAttribute("value", "2");
</script>
```

## 情况4
```HTML
<a href="/" id="logo"></a>
<script>
var a = document.querySelector('#logo')
console.log( a.getAttribute('href') )      // "/"
console.log( a.href )                      // "file:///C:/"
</script>
```
对于 a 链接的 href， 使用 a.getAttribute('href') 就是从 HTML 里获取对应属性的值转化成字符串，而 a.href 则获取有意义的真实地址，此处因为直接在桌面执行，所以根目录指向了C盘，链接才变成"file:///C:/"。

## 情况5

```HTML
<input id="username" type="text" sex="male" age=28 value="a">
<script>
var userInput = document.querySelector('#username');
userInput.value = "b";
console.log( userInput.value );                  // "b"
console.log( userInput.getAttribute('value'));   // "a"
userInput.setAttribute('value', 'c'); 
console.log( userInput.value );                  // "b"
console.log( userInput.getAttribute('value'));   // "c"
console.log( document.body.innerHTML ) ;  // <input id="username" type="text" sex="male" age=28 value="c">
</script>
```

**对于input 的 value， 改变 property 不会同步到 atttribute 上，改变 attribute也不会同步到 value上， attribute对应 HTML， property 对应 DOM。**

## 总结

综合以上情况，我们可以得出结论：
- 如果只是想获取非自定义的属性，比如 id、name、src、href 、checked... 用property的方式比较符合日常习惯，但是用getAttribute也可以，两者都没有问题。
- 如果想获取和设置自定义属性，只能使用getAttribute和setAttribute。
- 如果想要操作非自定义属性，主要是表单相关的元素，如input，select等，应该使用property的方式。

## 题外话

jQuery的prop方法就是用property的方式，而attr方法则相当于getAttribute和setAttribute（根据参数的不同）。

## 参考文章
- [button.property 和 button.getAttribute有什么区别？](https://zhuanlan.zhihu.com/p/22361337)