# document.open&write&close

## DOMContentLoaded

当初始的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，而无需等待样式表、图像和子框架的完全加载。

### 用法

```JavaScript
document.addEventListener("DOMContentLoaded", function (event) {
  console.log("DOM fully loaded and parsed");
});
```

**event 的属性**
| 属性 | 类型 | 描述 |
| --------------- | ----------- | ------------------------------------------- |
| target 只读 | EventTarget | 产生该事件的对象(DOM 树中最顶级的那个对象). |
| type 只读 | DOMString | 事件类型. |
| bubbles 只读 | Boolean | 该事件是否冒泡. |
| cancelable 只读 | Boolean | 该事件是否可取消默认行为. |

### 兼容性

IE 9+

### 参考文章

- [DOMContentLoaded](https://developer.mozilla.org/zh-CN/docs/Web/Events/DOMContentLoaded)
- [何谓 domReady](https://www.cnblogs.com/rubylouvre/p/4536334.html)

## document.write

document.write() 方法可向文档写入 HTML 表达式或 JavaScript 代码。可列出多个参数(exp1,exp2,exp3,...) ，它们将按顺序被追加到文档中。

### 语法

```JavaScript
document.write(exp1,exp2,exp3,....)
```

在 HTML 输出流中使用 `document.write`，文档不会被覆盖，在文档已加载后使用它（比如在函数中），会覆盖整个文档。这是因为浏览器有如下的执行流程：

- 调用 `document.open()` 打开文档
- `document.write(...)` 将下载到的网页内容写入文档
- 所有内容写完了，就调用 `document.close()`
- 触发 dom ready 事件（DOMContentReady）

所以你如果在第 3 步之前 `document.write(1)` 那么你就直接追加内容到当前位置，如果你在第 3 步之后 `document.write()`，那么由于 document 已经 close 了，所以这时候浏览器必须重新 `document.open()` 来打开文档，这一打开，内容就被清空了。

可以使用如下步骤来验证：

- 打开任意页面等加载完
- 在控制台运行 `document.write(1)`，会看到页面清空，只有一个 1
- 再次运行 `document.write(1)`，会发现页面没有清空，1 变成了 11，因为追加了一个 1
- 运行 `document.close()`，这是文档就关闭了。
- 再次运行 `document.write(1)`，你会发现文档又清空了，变成了 1。

## document.close

`Document.close()` 用于结束由 对文档的 `Document.write()` 写入操作，这种写入操作一般由 `Document.open()` 打开。

## document.open

`Document.open()` 方法打开一个要写入的文档。这将会有一些连带的影响。例如：

- 此时已注册到文档、文档中的节点或文档的 window 的所有事件监听器会被清除。
- 文档中的所有节点会被清除。

当 `document.write()` 在页面加载后调用，会发生自动的 `document.open()`调用。

很多年以来，Firefox 和 IE 浏览器会在清除所有节点的同时，将所有 Javascript 变量等一并清除，但现在已经不采用这一做法。

如果不想在当前文本追加内容， 使用 `open("text/html", "replace")` 替换 open().

比如页面上有如下同步代码

```JavaScript
document.addEventListener("DOMContentLoaded", function (event) {
  console.log("DOM fully loaded and parsed");
});

window.addEventListener("click", function (event) {
  console.log("click");
});

for (var i = 0; i < 1000000000; i++) {
  // 这个同步脚本将延迟DOM的解析。
  // 所以DOMContentLoaded事件稍后将启动。
}
```

由于同步代码会阻塞页面继续执行，所以等最下边的循环完成之后，可以看到浏览器控制台输出"DOM fully loaded and parsed"，点击页面任意位置可以看到浏览器控制台输出"click"。

然后继续在控制台操作，输入如下代码：

```JavaScript
document.write(1);
```

此时默认调用了`document.open`，所以所有事件监听器被清除，再在页面上点击是不会看到控制台输出的。文档中的所有节点清除，然后页面通过 document.write 写入内容 1 。

继续在控制台操作，输入如下代码：

```JavaScript
document.write(1);
```

由于文档并没有关闭，此时会继续追加，页面此时内容为 11 。

继续在控制台操作，输入如下代码：

```JavaScript
document.addEventListener("DOMContentLoaded", function (event) {
  console.log("DOM fully loaded and parsed");
});
```

我们又增加了 DOMContentLoaded 监听器，在文档完成时执行回调函数，此时仅仅添加了监听，并没有执行。

继续在控制台操作，输入如下代码：

```JavaScript
document.close();
```

此时文档完成，页面内容不变，控制台输出"DOM fully loaded and parsed"。

继续在控制台操作，输入如下代码：

```JavaScript
document.write(1);
```

跟之前一样，页面此时内容为 1 。

然后我们希望在不关闭文档（即调用`document.close`）的情况下，覆盖之前的内容（虽然这种操作很迷），我们可以在控制台输入如下代码：

```JavaScript
document.open("text/html", "replace");
```

此时就不是在当前文本追加内容，而是覆盖了。
