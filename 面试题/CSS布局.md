# CSS 布局

## 两侧部分宽度固定，中间部分宽度自适应的三栏布局

### 圣杯布局

圣杯布局实现了一个三栏式布局，特点为两侧部分宽度固定，中间部分宽度自适应。

HTML 代码如下：

```HTML
<div class="container">
    <div class="center"></div>
    <div class="left"></div>
    <div class="right"></div>
</div>
```

假设左侧的固定宽度为 200px，右侧的固定宽度为 150px，则首先在 container 上添加如下样式

```CSS
.container {
    padding-left: 200px;
    padding-right: 150px;
    overflow: hidden;
}
```

然后给三部分均设置为左浮动

```CSS
.left, .right, .center {
    float: left;
}
```

中间部分宽度设置为 100%

```CSS
.center {
    width: 100%;
}
```

左右两部分通过负 margin 和相对定位，使其分别处于中间部分两侧

```CSS
.left {
    width: 200px;
    margin-left: -100%;
    position: relative;
    right: 200px;
}
.right {
    width: 150px;
    margin-left: -150px;
    position: relative;
    left: 150px;
}
```

## 双飞翼布局

双飞翼布局和圣杯布局极为相似，区别在于多了一层用于布局的 div，不再使用相对定位。
具体的实现代码如下：

```HTML
<div class="container">
    <div class="center">
        <div class="content"></div>
    </div>
    <div class="left"></div>
    <div class="right"></div>
</div>
```

```CSS
.left, .right, .center {
    float: left;
}
.left {
    width: 200px;
    margin-left: -100%;
}
.right {
    width: 150px;
    margin-left: -150px;
}
.center {
    width: 100%;
}
.content {
    margin-left: 200px;
    margin-right: 150px;
}
```

圣杯布局和双飞翼布局是两种经典的布局方法，优势在于

- 兼容性好，兼容包括 IE6 在内的浏览器
- 可以实现主要内容的优先加载

在不考虑这两点的情况下，有更多的实现方法

### 使用 BFC 特性实现

```HTML
<div class="container">
    <div class="left"></div>
    <div class="right"></div>
    <div class="center"></div>
</div>
```

```CSS
.left {
    float: left;
    width: 200px;
}
.right {
    float: right;
    width: 150px;
}

.center {
    overflow: hidden;
}
```

### 使用calc()实现
```HTML
<div class="container">
    <div class="left"></div>
    <div class="center"></div>
    <div class="right"></div>
</div>
```

```CSS
.left, .center, .right {
    float: left;
}
.left {
    width: 200px;
}
.right {
    width: 150px;
}
.center {
    width: calc(100% - 200px - 150px);
}
```

### 使用绝对定位实现

这种方法容易出现父级高度塌陷的问题，一般不适用

### 使用 flex 布局实现

使用 flex 布局实现圣杯布局很简单，代码如下：
HTML 代码如下：

```HTML
<div class="container">
    <div class="left"></div>
    <div class="center"></div>
    <div class="right"></div>
</div>
```

CSS 代码如下：

```CSS
.container {
    display: flex;
}
.left, .right {
    flex-grow: 0;
    flex-shrink: 0;
}
.left {
    flex-basis: 200px;
}
.right {
    flex-basis: 150px;
}
.center {
    flex: 1 1 auto;
}
```

### 使用 grid 布局实现
之后补上

## 一侧宽度固定，另一侧宽度自适应的两栏布局
一侧宽度固定，另一侧宽度自适应的两栏布局实际上是上述三栏布局的简化版，不再赘述