var userInput = document.querySelector('#username');
userInput.value = "b";
console.log( userInput.value );                  // "b"
console.log( userInput.getAttribute('value'));   // "a"
userInput.setAttribute('value', 'c'); 
console.log( userInput.value );                  // "b"
console.log( userInput.getAttribute('value'));   // "c"
console.log( document.body.innerHTML ) ;  // <input id="username" type="text" sex="male" age=28 value="c">