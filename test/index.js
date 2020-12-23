let x = [1, 2],
  y = [3, 4];
~(function (x) {
  x.push("A");
  x = x.slice(0);
  x.push("B");
  x = y;
  x.push("C");
  console.log(x, y);
})(x);
console.log(x, y);
