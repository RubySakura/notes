let test = {
  num: 0,
  str: "",
  boolean: true,
  unf: undefined,
  nul: null,
  obj: {
    name: "我是一个对象",
    id: 1,
  },
  arr: [0, 1, 2],
  func: function () {
    console.log("我是一个函数");
  },
  date: new Date(0),
  reg: new RegExp("/我是一个正则/ig"),
  err: new Error("我是一个错误"),
};

let result = deepClone(test);

console.log(result);
for (let key in result) {
  if (isObject(result[key]))
    console.log(`${key}相同吗？ `, result[key] === test[key]);
}

// 判断是否为对象
function isObject(o) {
  return (typeof o === "object" || typeof o === "function") && o !== null;
}

function deepClone(obj, hash = new WeakMap()) {
  if (!isObject(obj)) {
    return obj;
  }
  // 查表
  if (hash.has(obj)) return hash.get(obj);

  let isArray = Array.isArray(obj);
  let cloneObj = isArray ? [] : {};
  // 哈希表设值
  hash.set(obj, cloneObj);

  let result = Object.keys(obj).map((key) => {
    return {
      [key]: deepClone(obj[key], hash),
    };
  });
  return Object.assign(cloneObj, ...result);
}
