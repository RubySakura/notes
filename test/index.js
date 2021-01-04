function Foo() {
  getName = function () { console.log (1); };
  return this;
}
Foo.getName = function () { console.log (2);};
Foo.prototype.getName = function () { console.log (3);return "888"};
var getName = function () { console.log (4);};
function getName() { console.log (5);}

//请写出以下输出结果：
Foo.getName(); // 
getName(); // 
Foo().getName(); // 
getName(); // 
new Foo.getName(); // 
console.log(new Foo().getName()); // 
console.log(new new Foo().getName()); // 

