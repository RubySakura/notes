# CSS部分

## 盒模型

所有HTML元素可以看作盒子，它包括：外边距Margin，边框Border，内边距Padding，和内容Content。

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
块格式化上下文（Block Formatting Context，BFC） 是Web页面的可视CSS渲染的一部分，是块盒子的布局过程发生的区域，也是浮动元素与其他元素交互的区域。

- 如何创建块格式化上下文
- 根元素（html）
- 浮动元素（元素的 float 不是 none）
- 绝对定位元素（元素的 position 为 absolute 或 fixed）
- 行内块元素（元素的 display 为 inline-block）
- 表格单元格（元素的 display 为 table-cell，HTML表格单元格默认为该值）
- 表格标题（元素的 display 为 table-caption，HTML表格标题默认为该值）
- 匿名表格单元格元素（元素的 display 为 table、table-row、 table-row-group、table-header-group、table-footer-group（分别是HTML table、row、tbody、thead、tfoot 的默认属性）或 inline-table）
- overflow 值不为 visible 的块元素
- display 值为 flow-root 的元素
- contain 值为 layout、content 或 paint 的元素
- 弹性元素（display 为 flex 或 inline-flex 元素的直接子元素）
- 网格元素（display 为 grid 或 inline-grid 元素的直接子元素）
- 多列容器（元素的 column-count 或 column-width 不为 auto，包括 column-count 为 1）
- column-span 为 all 的元素始终会创建一个新的BFC，即使该元素没有包裹在一个多列容器中（标准变更，Chrome bug）。

### 特性
块格式化上下文对浮动定位（参见 float）与清除浮动（参见 clear）都很重要。浮动定位和清除浮动时只会应用于同一个BFC内的元素。浮动不会影响其它BFC中元素的布局，而清除浮动只能清除同一BFC中在它前面的元素的浮动。外边距折叠（Margin collapsing）也只会发生在属于同一BFC的块级元素之间。

### 范例

#### 1. 让浮动内容和周围的内容等高
在没有BFC的情况下，内层float元素无法撑起外层元素高度

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

外层元素生成BFC，在之前的基础上加上

CSS
```css
.out {
    overflow: hidden;
}
```
这样内层float元素就可以撑起外层高度了，但是出现了新的问题，`overflow: hidden`会导致内层所有定位元素在超出外层范围时被隐藏，使用清除浮动（bootstrap3大量使用）或者flex布局可以解决该问题。

如果不考虑IE兼容性的情况下，也可以使用`display:flow-root`，元素，一个新的 display 属性的值，它可以创建无副作用的 BFC，无论是内联元素，还是原本就是块级元素，在应用 `display:flow-root` 声明后，都会变成块级元素，同时这个元素会创建无副作用的BFC。
CSS
```css
.out {
    display: flow-root;
}
```

#### 2. 阻止元素被浮动元素覆盖
在没有BFC的情况下，float元素会脱离文档流，在该元素之后的块级元素会被该元素覆盖，行内元素不会被覆盖，而是环绕该元素，如下代码可以实现文字环绕效果

HTML
```html
<div class="out">
    <div class="inner"></div>
    <div class="bfc">这些文字将会环绕上一个float元素，这些文字将会环绕上一个float元素，这些文字将会环绕上一个float元素，这些文字将会环绕上一个float元素，这些文字将会环绕上一个float元素，这些文字将会环绕上一个float元素，这些文字将会环绕上一个float元素，这些文字将会环绕上一个float元素</div>
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
如果我们想避免第二个元素被覆盖，可以触发第二个元素的BFC，在之前的基础上加上

CSS
```css
.bfc {
    overflow: hidden;
}
```
借助这种特性，我们可以实现两列自适应布局，左边的宽度固定，右边的内容自适应宽度。或者三列自适应布局，两边宽度固定，中间自适应宽度（注意两个float元素要放在bfc元素前边）。

### 总结

BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。

因为BFC内部的元素和外部的元素绝对不会互相影响，因此， 当BFC外部存在浮动时，它不应该影响BFC内部Box的布局，BFC会通过变窄，而不与浮动有重叠。同样的，当BFC内部有浮动时，为了不影响外部元素的布局，BFC计算高度时会包括浮动的高度。避免margin重叠也是这样的一个道理。