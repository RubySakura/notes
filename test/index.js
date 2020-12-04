const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function MyPromise(executor) {
  let self = this;
  self.state = PENDING;

  self.value = null;
  self.reason = null;

  self.onFulfilledCallbacks = [];
  self.onRejectedCallbacks = [];

  function resolve(value) {
    if (self.state === PENDING) {
      self.state = FULFILLED;
      self.value = value;

      self.onFulfilledCallbacks.forEach(function (fulfilledCallback) {
        fulfilledCallback();
      });
    }
  }

  function reject(reason) {
    if (self.state === PENDING) {
      self.state = REJECTED;
      self.reason = reason;

      self.onRejectedCallbacks.forEach(function (rejectedCallback) {
        rejectedCallback();
      });
    }
  }

  try {
    executor(resolve, reject);
  } catch (reason) {
    reject(reason);
  }
}

MyPromise.prototype.then = function (onFuifilled, onRejected) {
  let self = this;
  let promise2 = null;

  promise2 = new MyPromise((resolve, reject) => {
    if (self.state === PENDING) {
      self.onFulfilledCallbacks.push(() => {
        try {
          let x = onFuifilled(self.value);
          self.resolvePromise(promise2, x, resolve, reject);
        } catch (reason) {
          reject(reason);
        }
      });
      self.onRejectedCallbacks.push(() => {
        try {
          let x = onRejected(self.reason);
          self.resolvePromise(promise2, x, resolve, reject);
        } catch (reason) {
          reject(reason);
        }
      });
    }

    if (self.state === FULFILLED) {
      try {
        let x = onFuifilled(self.value);
        self.resolvePromise(promise2, x, resolve, reject);
      } catch (reason) {
        reject(reason);
      }
    }

    if (self.state === REJECTED) {
      try {
        let x = onRejected(self.reason);
        self.resolvePromise(promise2, x, resolve, reject);
      } catch (reason) {
        reject(reason);
      }
    }
  });

  return promise2;
};

MyPromise.prototype.resolvePromise = function (promise2, x, resolve, reject) {
  let self = this;
  let called = false; // called 防止多次调用

  if (promise2 === x) {
    return reject(new TypeError("循环引用"));
  }

  if (
    x !== null &&
    (Object.prototype.toString.call(x) === "[object Object]" ||
      Object.prototype.toString.call(x) === "[object Function]")
  ) {
    // x是对象或者函数
    try {
      let then = x.then;

      if (typeof then === "function") {
        then.call(
          x,
          (y) => {
            // 别人的Promise的then方法可能设置了getter等，使用called防止多次调用then方法
            if (called) return;
            called = true;
            // 成功值y有可能还是promise或者是具有then方法等，再次resolvePromise，直到成功值为基本类型或者非thenable
            self.resolvePromise(promise2, y, resolve, reject);
          },
          (reason) => {
            if (called) return;
            called = true;
            reject(reason);
          }
        );
      } else {
        if (called) return;
        called = true;
        resolve(x);
      }
    } catch (reason) {
      if (called) return;
      called = true;
      reject(reason);
    }
  } else {
    // x是普通值，直接resolve
    resolve(x);
  }
};

let promise = new MyPromise(function (resolve, reject) {
  setTimeout(function () {
    resolve(123);
  }, 1000);
});

promise.then(
  function (value) {
    console.log("value1", value);
  },
  function (reason) {
    console.log("reason1", reason);
  }
);

promise.then(
  function (value) {
    console.log("value2", value);
  },
  function (reason) {
    console.log("reason2", reason);
  }
);
