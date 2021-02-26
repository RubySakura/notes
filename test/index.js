function a() {}

console.log(a.prototype.__proto__ === Object.prototype);
console.log(a.constructor === Function);
console.log(Function instanceof Object);