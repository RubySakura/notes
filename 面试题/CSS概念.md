# CSS 部分

## 盒模型

所有 HTML 元素可以看作盒子，它包括：外边距 Margin，边框 Border，内边距 Padding，和内容 Content。

盒模型分为标准模型和怪异盒模型（IE 盒模型）

- 标准盒模型：盒模型的宽高只是内容（content）的宽高
- 怪异盒模型：盒模型的宽高是内容(content)+填充(padding)+边框(border)的总宽高

问题：css 如何设置两种模型

```CSS
/* 标准模型 */
box-sizing:content-box;

 /*IE模型*/
box-sizing:border-box;
```

## BFC

### 概念

块格式化上下文（Block Formatting Context，BFC） 是 Web 页面的可视 CSS 渲染的一部分，是块盒子的布局过程发生的区域，也是浮动元素与其他元素交互的区域。

- 如何创建块格式化上下文
- 根元素（html）
- 浮动元素（元素的 float 不是 none）
- 绝对定位元素（元素的 position 为 absolute 或 fixed）
- 行内块元素（元素的 display 为 inline-block）
- 表格单元格（元素的 display 为 table-cell，HTML 表格单元格默认为该值）
- 表格标题（元素的 display 为 table-caption，HTML 表格标题默认为该值）
- 匿名表格单元格元素（元素的 display 为 table、table-row、 table-row-group、table-header-group、table-footer-group（分别是 HTML table、row、tbody、thead、tfoot 的默认属性）或 inline-table）
- overflow 值不为 visible 的块元素
- display 值为 flow-root 的元素
- contain 值为 layout、content 或 paint 的元素
- 弹性元素（display 为 flex 或 inline-flex 元素的直接子元素）
- 网格元素（display 为 grid 或 inline-grid 元素的直接子元素）
- 多列容器（元素的 column-count 或 column-width 不为 auto，包括 column-count 为 1）
- column-span 为 all 的元素始终会创建一个新的 BFC，即使该元素没有包裹在一个多列容器中（标准变更，Chrome bug）。

### 特性

块格式化上下文对浮动定位（参见 float）与清除浮动（参见 clear）都很重要。浮动定位和清除浮动时只会应用于同一个 BFC 内的元素。浮动不会影响其它 BFC 中元素的布局，而清除浮动只能清除同一 BFC 中在它前面的元素的浮动。外边距折叠（Margin collapsing）也只会发生在属于同一 BFC 的块级元素之间。

### 范例

#### 1. 让浮动内容和周围的内容等高

在没有 BFC 的情况下，内层 float 元素无法撑起外层元素高度

HTML

```html
<div class="out">
  <div class="inner"></div>
</div>
```

CSS

```css
.inner {
  float: left;
  width: 200px;
  height: 300px;
}
```

外层元素生成 BFC，在之前的基础上加上

CSS

```css
.out {
  overflow: hidden;
}
```

这样内层 float 元素就可以撑起外层高度了，但是出现了新的问题，`overflow: hidden`会导致内层所有定位元素在超出外层范围时被隐藏，使用清除浮动（bootstrap3 大量使用）或者 flex 布局可以解决该问题。

如果不考虑 IE 兼容性的情况下，也可以使用`display:flow-root`，元素，一个新的 display 属性的值，它可以创建无副作用的 BFC，无论是内联元素，还是原本就是块级元素，在应用 `display:flow-root` 声明后，都会变成块级元素，同时这个元素会创建无副作用的 BFC。
CSS

```css
.out {
  display: flow-root;
}
```

#### 2. 阻止元素被浮动元素覆盖

在没有 BFC 的情况下，float 元素会脱离文档流，在该元素之后的块级元素会被该元素覆盖，行内元素不会被覆盖，而是环绕该元素，如下代码可以实现文字环绕效果

HTML

```html
<div class="out">
  <div class="inner"></div>
  <div class="bfc">
    这些文字将会环绕上一个float元素，这些文字将会环绕上一个float元素，这些文字将会环绕上一个float元素，这些文字将会环绕上一个float元素，这些文字将会环绕上一个float元素，这些文字将会环绕上一个float元素，这些文字将会环绕上一个float元素，这些文字将会环绕上一个float元素
  </div>
</div>
```

CSS

```css
.inner {
  float: left;
  width: 200px;
  height: 300px;
}
```

如果我们想避免第二个元素被覆盖，可以触发第二个元素的 BFC，在之前的基础上加上

CSS

```css
.bfc {
  overflow: hidden;
}
```

借助这种特性，我们可以实现两列自适应布局，左边的宽度固定，右边的内容自适应宽度。或者三列自适应布局，两边宽度固定，中间自适应宽度（注意两个 float 元素要放在 bfc 元素前边）。

### 总结

BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。

因为 BFC 内部的元素和外部的元素绝对不会互相影响，因此， 当 BFC 外部存在浮动时，它不应该影响 BFC 内部 Box 的布局，BFC 会通过变窄，而不与浮动有重叠。同样的，当 BFC 内部有浮动时，为了不影响外部元素的布局，BFC 计算高度时会包括浮动的高度。避免 margin 重叠也是这样的一个道理。

## 负margin

### 作用于static元素上的负margin属性

当static元素的margin-top/margin-left被赋予负值时，元素将被拉进指定的方向。
当static元素的margin-bottom/margin-right被赋予负值时，元素将将后续的元素拖拉进来，覆盖本来的元素。
当static元素没有设定width属性时，设定负margin-left/margin-right会将元素拖向对应的方向，并增加宽度。

### 作用于float元素上的负margin属性
当float元素的margin-top/margin-left被赋予负值时，元素将被拉进指定的方向。
当float元素的margin-bottom/margin-right被赋予负值时，元素将将后续的元素拖拉进来，覆盖本来的元素。

### 作用于绝对定位元素上的负margin属性
当float元素的margin被赋予负值时，元素将基于其绝对定位坐标再偏移。
可用于知道居中元素宽高的情况下实现垂直水平居中。

### 实例
圣杯、双飞翼等布局不再赘述，以下为借助负margin制作包含3列的单个ul
```html
<ul> 
  <li class="col1">Eggs</li> 
  <li class="col1">Ham</li> 
  <li class="col2 top">Bread</li> 
  <li class="col2">Butter</li> 
  <li class="col3 top">Flour</li> 
  <li class="col3">Cream</li> 
</ul>
```

CSS

```css
ul {list-style:none;}
li {line-height:1.3em;}
.col2 {margin-left:100px;}
.col3 {margin-left:200px;}
.top {margin-top:-2.6em;}
```