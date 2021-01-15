# 仅执行dblclick而不执行click的方法

当我们同时给一个按钮绑定click和dblclick的时候：

HTML:

```HTML
<button id="btn">点我</button>
```

JavaScript：

```JavaScript
var btn = document.querySelector("#btn");

btn.addEventListener("click", function (e) {
  console.log("btn click");
});

btn.addEventListener("dblclick", function (e) {
  console.log("btn dblclick");
});
```

双击按钮，输出如下：
```
btn click
btn click
btn dblclick
```

可以看到，click和dblclick事件都被触发了，这是因为双击(dblclick)的流程是：mousedown，mouseout，click，mousedown，mouseout，click，dblclick。

如果我们想在双击的时候仅执行dblclick而不执行click的话，可以使用如下方法：

```JavaScript
var btn = document.querySelector("#btn");

var timers = [];

btn.addEventListener("click", function (e) {
  var timer = setTimeout(function () {
    console.log("btn click");
  }, 300);
  timers.push(timer);
});

btn.addEventListener("dblclick", function (e) {
  timers.forEach(function(item) {
    clearTimeout(item);
  });
  console.log("btn dblclick");
});
```

## 参考文章

- [同时绑定click和double click冲突的问题](https://blog.csdn.net/liduanwh/article/details/79501903)