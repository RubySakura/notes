# 移动端 1px

在进行移动端网页开发的时候，最常见的问题就是，根据设计稿给出的标注，设置某个边框线宽度为 1px，结果发现跟设计稿比起来，这个 1px 要粗很多，这就是知名的移动端 1px 问题。

我们知道，像素有物理像素和逻辑像素之分，设计师交付给前端开发一张宽度为 750px 的视觉稿，这里的 750px 就是物理像素，但是我们的页面最后在一个设备像素比为 2，逻辑像素宽度为 375px 的设备上展示，由于两个物理像素等于一个逻辑像素，所以此时我们的 1px 边框，相当于 2px。

其实这并不是开发的问题，因为我们确实是按照逻辑像素 1px 设置了这个边框的宽度，但是在设计师看来，应该是一个物理像素 1px 的边框才对，所以在开发的角度来看，其实设计师需要的是一个逻辑像素 0.5px 的边框。

那我们该如何解决呢，有如下的办法：

## 解决方案

### 使用flexible.js

阿里无线前端团队之前开源一套移动端适配的方案：flexible.js，使用方式很简单，直接在页面的`<head></head>` 中添加对应的 flexible_css.js,flexible.js 文件即可。

flexible 实际上就是能过 JS 来动态改写 meta 标签，事实上他做了这几样事情：

- 动态改写 `<meta>` 标签
- 给 `<html>` 元素添加 data-dpr 属性，并且动态改写 data-dpr 的值
- 给 `<html>` 元素添加 font-size 属性，并且动态改写 font-size 的值

flexible 将 html 的 font-size 属性设置为屏幕宽度的 1 / 100，所以此时我们想要设置一个宽度为屏幕宽度 50%，高度为宽度一半的 div，就可以将此 div 设置为宽度为 50rem， 高度为 25rem。

以上是 flexible 的简单介绍，之所以提到这个开源库，是因为它也同时解决了 1px 边框的问题，为了能让页面更好的适配各种不同的终端，flexible 通过 Hack 手段来根据设备的 dpr 值相应改变`<meta>`标签中 viewport 的值：

```HTML
<!-- dpr = 1-->
<meta name="viewport" content="initial-scale=scale,maximum-scale=scale,minimum-scale=scale,user-scalable=no">
<!-- dpr = 2-->
<meta name="viewport" content="initial-scale=0.5,maximum-scale=0.5,minimum-scale=0.5,user-scalable=no">
<!-- dpr = 3-->
<meta name="viewport" content="initial-scale=0.3333333333,maximum-scale=0.3333333333,minimum-scale=0.3333333333,user-scalable=no">
```

通过强制缩放，使得页面物理像素和逻辑像素相等，此时就不会出现 1px 边框的问题了。

比如在逻辑像素为 375px 的情况下，加上`<meta name="viewport" content="initial-scale=0.5,maximum-scale=0.5,minimum-scale=0.5,user-scalable=no">`，此时在 js 中执行`console.log(window.innerWidth);`，输出结果为 750。

但是现在这种方法很少用了，在 flexible 的 readme 中也提到：

> 由于 viewport 单位得到众多浏览器的兼容，lib-flexible 这个过渡方案已经可以放弃使用，不管是现在的版本还是以前的版本，都存有一定的问题。建议大家开始使用 viewport 来替代此方。

也就是说，现在做这种移动端适配，更多的是使用 vw，vh 这种 viewport 单位，而不是 rem 了。

### 直接设置

直接设置边框`border-width: 0.5px;`，使用方便，缺点是但兼容性很差，不推荐使用。

```CSS
.box {
  border: 0.5px solid #000;
}
```

### 用阴影代替边框

用阴影代替边框 `box-shadow: 0 0 0 .5px #000;`，使用方便，能正常展示圆角，缺点是兼容性一般，不能单独设置一条边框。

```CSS
.box {
  box-shadow: 0 0 0 0.5px #000;
}
```

### 给容器设置伪元素

给容器设置伪元素，设置绝对定位，高度为 1px，背景图为线性渐变，一半有颜色，一半透明。视觉上宽度只有 0.5px。缺点是这种方法只适合设置一条边框，并且没法展示圆角。

```CSS
.box {
  position: relative;
}
.box::after {
  position: absolute;
  content: "";
  bottom: 0;
  height: 1px;
  width: 100%;
  background-image: linear-gradient(0deg, #000, transparent);
}
```

### 给容器内设置伪元素

给容器内设置伪元素，设置绝对定位，宽、高是 200%，边框是 1px，然后使用`transform: scale(0.5)` 让伪元素缩小原来的一半，这时候伪元素的边框和容器的边缘重合，视觉上宽度只有 0.5px。这种方法兼容性最好，4 个边框都能一次性设置，能正常展示圆角，推荐使用。

```CSS
.box {
  position: relative;
}
.box::after {
  position: absolute;
  bottom: 0;
  z-index: -1; /* 防止box的内容无法操作 */
  width: 200%;
  height: 200%;
  content: "";
  display: block;
  border: 1px solid #000;
  border-radius: 16px; /* 圆角必须*2，如此处想要8px的圆角就必须写16px */
  transform: scale(0.5);
  transform-origin: left bottom;
}
```

综上，可以得出如下结论：

- 使用图片：这种方案没有提，也不常见，优点是兼容性最好，缺点是灵活性最差，不能改变颜色。
- 使用 viewport 和 rem，js 动态改变 viewport 中 scale 缩放，如之前提到的 flexible.js，缺点在于不适用于已有的项目，个别兼容性不够好（如 iframe）。
- 使用 css 渐变 linear-gradient 或者 box-shadow，兼容性较差，并且 linear-gradient 只适用于一条边框，box-shadow 无法设置单独的一条边框。
- 综上，伪元素 + scale 的方法，是比较好的解决方法。

我们对伪元素 + scale 的做法优化一下，引入 min-device-pixel-ratio（即设备上物理像素和设备独立像素的比例）：

```CSS
.box {
  position: relative;
}
.box::after {
  position: absolute;
  bottom: 0;
  z-index: -1; /* 防止box的内容无法操作 */
  content: "";
  display: block;
  border: 1px solid #000;
  transform-origin: left bottom;

  width: 100%;
  height: 100%;
  border-radius: 8px;
  transform: scale(1);
}
@media (-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2) {
  .box::after {
    width: 200%; /* 100% * 2 */
    height: 200%; /* 100% * 2 */
    border-radius: 16px; /* 8px * 2 */
    transform: scale(0.5); /* 1 / 2 */
  }
}
@media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3) {
  .box::after {
    width: 300%; /* 100% * 3 */
    height: 300%; /* 100% * 3 */
    border-radius: 24px; /* 8px * 3 */
    transform: scale(0.33); /* 1 / 3 */
  }
}
```

### 使用`postcss-write-svg`插件

这种没用过，后续研究。



## 参考文章

- [手机上如何实现细/1px/0.5px 边框](https://zhuanlan.zhihu.com/p/340711204)
- [吃透移动端 1px (hairline)](https://zhuanlan.zhihu.com/p/268419107)
- [前端读者 | 移动端适配问题解决方案](https://www.cnblogs.com/chenrf/p/9892751.html)
- [再谈Retina下1px的解决方案](https://www.lisa33xiaoq.net/515.html)
- [再聊移动端页面的适配](https://blog.csdn.net/qq_21729177/article/details/79466951)
- [1px 究竟是多大](https://www.cnblogs.com/kidney/p/6692312.html)
- [关于移动端开发1px线的一些理解和解决办法](https://zhuanlan.zhihu.com/p/73261198)
