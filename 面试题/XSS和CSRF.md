# XSS 和 CSRF

## XSS

XSS 全称(Cross Site Scripting) 跨站脚本攻击， 是 Web 程序中最常见的漏洞。指攻击者在网页中嵌入客户端脚本(例如 JavaScript), 当用户浏览此网页时，脚本就会在用户的浏览器上执行，从而达到攻击者的目的. 比如获取用户的 Cookie，导航到恶意网站,携带木马等。

### XSS 分类

- 反射型 XSS  
  反射型 XSS，是一种非持久化的 XSS，主要出现在开发者没有过滤 URL 参数，导致攻击者可以在 URL 参数中写入 JavaScript 脚本，后端没有过滤参数，所以返回的页面中执行了该脚本。然后诱使用户点击该链接，从而获取 ookie 等用户数据用户数据。反射型 XSS 并不储存到服务器，也不能对所有访问该页面的人造成攻击，只能诱导点击有问题的链接，危害较小。  
  比如有一个页面 `test.com?title=Hello`，返回的页面将 title 参数的值渲染到页面上，如果没有过滤该参数，那么访问链接 `test.com?title=<script>alert(document.cookie)</script>`就可以实现 XSS 攻击

- 存储型 XSS  
  存储型 XSS，是一种持久化的 XSS，代码是存储在服务器中的，如在个人信息或发表文章等地方，加入代码，如果没有过滤或过滤不严，那么这些代码将储存到服务器中，每当有用户访问该页面的时候都会触发代码执行，这种 XSS 非常危险，容易造成蠕虫，大量盗窃 cookie。
  比如输入文章标题的 input 没有进行 XSS 过滤，`<input type="text" name="title" value="">`，那么当攻击者输入：`<script>alert(document.cookie)</script>`，那么所有访问该文章的用户都会受到 XSS 攻击。

- DOM 型 XSS  
  DOM 型 XSS 其实是一种特殊类型的反射型 XSS，它是基于 DOM 文档对象模型的一种漏洞，正常的反射型 XSS，一般是由于 URL 参数中写入了 JavaScript 脚本，后端没有过滤参数，所以返回的页面中执行了该脚本，需要后端的参与，而 DOM 型 XSS 不需要后端的参与，比如页面`test.com`中有一段代码：
  ```HTML
  <script>
    document.write("<b>Current URL</b> : " + document.baseURI);
  </script>
  ```
  那么此时用户访问该页面链接`test.com#<script>alert(document.cookie)</script>`，就有会受到 XSS 攻击。有很多属性都有可能出发 DOM 型 XSS 攻击，比如 document.referer 属性、window.name 属性、location 属性、innerHTML 属性和 documen.write 属性等。

### XSS 的防御方法

- 通用
  - 将重要的cookie标记为http only
  - 只允许用户输入我们期望的数据
  - 对数据进行Html Encode 处理

- 反射型 XSS  
  通过 URL 的查询字符串渲染页面时，先进行过滤再输出，输出到 HTML 的进行 HTML 过滤，输出到 Javascript 的进行 Javascript 过滤。
- 存储型 XSS  
  后端在存储之前进行过滤，之后要输出到 HTML 的进行 HTML 过滤，要输出到 Javascript 的进行 Javascript 过滤。
- DOM 型 XSS
  DOM 型 XSS 主要是由客户端的脚本通过 DOM 动态地输出数据到页面而不是依赖于将数据提交给服务器端，而从客户端获得 DOM 中的数据在本地执行，因而仅从服务器端是无法防御的。其防御在于：
  - 避免客户端文档重写、重定向或其他敏感操作，同时避免使用客户端数据，这些操作尽量在服务器端使用动态页面来实现；
  - 分析和强化客户端 JS 代码，特别是受到用户影响的 DOM 对象，注意能直接修改 DOM 和创建 HTML 文件的相关函数或方法，并在输出变量到页面时先进行编码转义，如输出到 HTML 则进行 HTML 编码、输出到 script 则进行 JS 编码。

### HTML Encode

一般情况下，不需要前端进行 XSS 的过滤，但是特殊情况如 DOM 型 XSS，是需要 HTML 过滤的，实际上是将敏感字符过滤成 HTML 实体，具体需要过滤的字符如下：
| 敏感字符 | HTML 实体 |
| -------- | --------- |
| <        | `&lt;`    |
| >        | `&gt;`    |
| &        | `&amp;`   |
| '        | `&#039;`  |
| "        | `&quot;`  |


具体实现有两种：  

#### 用浏览器内部转换器实现转换
```JavaScript
var HtmlUtil = {
    /*1.用浏览器内部转换器实现html转码*/
    htmlEncode:function (html){
        //1.首先动态创建一个容器标签元素，如DIV
        var temp = document.createElement ("div");
        //2.然后将要转换的字符串设置为这个元素的innerText(ie支持)或者textContent(火狐，google支持)
        (temp.textContent != undefined ) ? (temp.textContent = html) : (temp.innerText = html);
        //3.最后返回这个元素的innerHTML，即得到经过HTML编码转换的字符串了
        var output = temp.innerHTML;
        temp = null;
        return output;
    },
    /*2.用浏览器内部转换器实现html解码*/
    htmlDecode:function (text){
        //1.首先动态创建一个容器标签元素，如DIV
        var temp = document.createElement("div");
        //2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
        temp.innerHTML = text;
        //3.最后返回这个元素的innerText(ie支持)或者textContent(火狐，google支持)，即得到经过HTML解码的字符串了。
        var output = temp.innerText || temp.textContent;
        temp = null;
        return output;
    }
};
```

#### 用正则表达式进行转换处理
```JavaScript
var HtmlUtil = {
    /*1.用正则表达式实现html转码*/
    htmlEncodeByRegExp: function (str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&/g, "&amp;");
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        s = s.replace(/ /g, "&nbsp;");
        s = s.replace(/\'/g, "&#39;");
        s = s.replace(/\"/g, "&quot;");
        return s;
    },
    /*2.用正则表达式实现html解码*/
    htmlDecodeByRegExp: function (str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&amp;/g, "&");
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/&#39;/g, "'");
        s = s.replace(/&quot;/g, '"');
        return s;
    },
};
```

### HTML Encode 和 URL Encode 的区别
HTML Encode的目的如上，URL Encode的目的是为了符合URL的规范，因为在标准的URL规范中中文和很多的字符是不允许出现在url中的。
URL的规范实际上就是ASCII规范，只有数字、字母和以下特殊字符是符合规范的：
```
- _ . ! ~ * ' ( ) 
```

URL Encode有两个方法：
- encodeURI
  该方法不会对 ASCII 字母和数字进行编码，也不会对这些 ASCII 标点符号进行编码： - _ . ! ~ * ' ( ) 。  
  该方法的目的是对 URI 进行完整的编码，因此对以下在 URI 中具有特殊含义的 ASCII 标点符号，encodeURI() 函数是不会进行转义的：;/?:@&=+$,#

- encodeURIComponent
  该方法不会对 ASCII 字母和数字进行编码，也不会对这些 ASCII 标点符号进行编码： - _ . ! ~ * ' ( ) 。  
  其他字符（比如 ：;/?:@&=+$,# 这些用于分隔 URI 组件的标点符号），都是由一个或多个十六进制的转义序列替换的。

总结来说，如果你需要编码整个URL，然后需要使用这个URL，那么用encodeURI。当你需要编码URL中的参数的时候，那么encodeURIComponent是最好方法。

## CSRF
[浅谈CSRF攻击方式](https://www.cnblogs.com/hyddd/archive/2009/04/09/1432744.html)
[CSRF 是什么？](https://zhuanlan.zhihu.com/p/22521378)

### CSRF是什么？
CSRF（Cross-site request forgery），中文名称：跨站请求伪造，也被称为：one click attack/session riding，缩写为：CSRF/XSRF。

### CSRF可以做什么？
攻击者盗用用户身份，以用户的名义发送恶意请求。

### CSRF的原理
要完成一次CSRF攻击，受害者必须依次完成两个步骤：
- 登录受信任网站A，并在本地生成Cookie。
- 在不登出A的情况下，访问危险网站B。

### CSRF的攻击手段
- 受信任网站A过度使用GET请求进行除查询外的操作，导致受害者访问危险网站B时，攻击者可以简单的使用img等标签直接向A发起携带认证信息的GET请求，发起CSRF攻击。
- 受害者访问危险网站B时，B伪造了一个POST表单，并自动提交表单，，发起CSRF攻击。

### CSRF的防御
- 尽量少的使用GET请求，最好只使用GET请求进行查询操作。
- 在服务端生成伪随机数，将其写入cookie和页面表单，每次提交在服务端验证cookie和表单内的值是否一致，由于伪造表单无法获取伪随机数，所以CSRF攻击失败。
- 使用图片验证码，每次的用户提交都需要用户在表单中填写一个图片上的随机字符串，这个方法只适用于需要较高安全性的表单，如果全都有验证码用户体验不是太好。