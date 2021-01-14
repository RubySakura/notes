// 创建一个支持冒泡且不能被取消的look事件
var btn = document.querySelector("#btn");
var out = document.querySelector("#out");

out.onclick = function() {
    console.log('out click');
}

btn.addEventListener("click", function(e) {
    console.log("btn click 1");
});

btn.addEventListener("click", function(e) {
    console.log("btn click 2");
    e.stopImmediatePropagation();
});

btn.addEventListener("click", function(e) {
    console.log("btn click 3");
});





// btn.addEventListener("click", function(e) {
//     console.log("btn click 1");
//     e.stopImmediatePropagation();
// });

// btn.addEventListener("click", function(e) {
//     console.log("btn click 2");
// });

// btn.addEventListener("dblclick", function(e) {
//     console.log("btn dblclick");
// });

// out1.onclick = function() {
//     console.log('out1');
// }

// out2.onclick = function() {
//     console.log('out2');
// }

// out1.ondblclick = function() {
//     console.log('out1 db');
// }