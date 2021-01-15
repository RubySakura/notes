var btn = document.querySelector("#btn");

var timers = [];

btn.addEventListener("click", function (e) {
  var timer = setTimeout(function () {
    console.log("btn click");
  }, 300);
  timers.push(timer);
});

btn.addEventListener("dblclick", function (e) {
  timers.forEach(function(item) {
    clearTimeout(item);
  });
  console.log("btn dblclick");
});
