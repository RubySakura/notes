# 手写call和apply

call、apply 函数的实现其实都借助了点调用。利用第一个参数做个中转，调用完之后删除。

## 手写call

```JavaScript
Function.prototype.myCall = function (context = windows, ...args) {
  context._callFn = this;
  const result = context._callFn(...args);
  delete context._callFn;
  return result;
};
```

## 手写apply

```JavaScript
Function.prototype.myApply = function (context = windows, args) {
  context._applyFn = this;
  const result = context._applyFn(...args);
  delete context._applyFn;
  return result;
};
```

## 参考文章
- [几个面试常见手写代码](https://juejin.cn/post/6917811484898623495)