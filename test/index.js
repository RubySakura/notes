// https://juejin.cn/post/6917811484898623495

function Person(name, sex) {
  var obj = Object.create(Person.prototype); //手工指定原型
  obj.name = name;
  obj.sex = sex;
  return obj;
}

Person.prototype.introduce = function () {
  console.log(`我是${this.name}，是个${this.sex}。`);
}

Person("jian", "male").introduce();
new Person("jian", "male").introduce();