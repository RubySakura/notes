# stopImmediatePropagation

## stopPropagation 和 stopImmediatePropagation

`stopPropagation` 和 `stopImmediatePropagation` 的相同处在于：都用于阻止捕获和冒泡阶段中当前事件的进一步传播，都不能防止任何默认行为的发生； 例如，对链接的点击仍会被处理（如果要停止这些行为，使用 `preventDefault` 方法）。

区别在于 `stopPropagation` 仅仅阻止事件冒泡，而 `stopImmediatePropagation` 阻止事件冒泡并且阻止该元素上同事件类型的监听器被触发。

具体为：如果多个事件监听器被附加到相同元素的**相同事件类型**上，当此事件触发时，它们会按其被添加的顺序被调用。如果在其中一个事件监听器中执行 `stopImmediatePropagation()` ，那么剩下的事件监听器都不会被调用。

比如说如下例子：

HTML:

```HTML
<div id="out">
    <button id="btn">点我</button>
</div>
```

JavaScript：

```JavaScript
let btn = document.querySelector("#btn");
let out = document.querySelector("#out");

out.onclick = function() {
    console.log('out click');
}

btn.addEventListener("click", function(e) {
    console.log("btn click 1");
});

btn.addEventListener("click", function(e) {
    console.log("btn click 2");
    e.stopPropagation();
});

btn.addEventListener("click", function(e) {
    console.log("btn click 3");
});
```

点击按钮，可以看到控制台输出如下：

```
btn click 1
btn click 2
btn click 3
```

也就是说，点击事件并没有冒泡到外层，但是绑定在按钮上的事件全部执行了。

下面修改一下 JavaScript 代码，修改部分如下：

```JavaScript
btn.addEventListener("click", function(e) {
    console.log("btn click 2");
    e.stopImmediatePropagation();
});
```

再次点击按钮，可以看到控制台输出如下：

```
btn click 1
btn click 2
```

也就是说，点击事件也没有冒泡到外层，但是绑定在按钮上的第三个事件没有被执行，这就是 stopImmediatePropagation 的主要作用。

需要注意的是，stopImmediatePropagation 只会作用于相同事件类型的监听器，比如此时在按钮上绑定了一个 dblclick 类型的监听器，click 中执行的 stopImmediatePropagation 时不起作用的。

## 参考文章

- [Event.stopPropagation()](https://developer.mozilla.org/zh-TW/docs/Web/API/Event/stopPropagation)
- [event.stopImmediatePropagation](https://developer.mozilla.org/zh-cn/docs/web/api/event/stopimmediatepropagation)
- [stopPropagation 与 stopImmediatePropagation 的区别](https://blog.csdn.net/weixin_42420703/article/details/104585427)
