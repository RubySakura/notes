function Foo() {};
Foo.prototype.a = 1;
Foo.prototype.b = function() {console.log('b')};

var foo = new Foo();
foo.c = 2;

for(let key in foo) {
    console.log('key', key);
    console.log(foo[key]);
}
