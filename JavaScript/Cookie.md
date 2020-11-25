# Cookie

## cookie 是怎么工作的？

cookie 其实是存储在浏览器中的纯文本，浏览器的安装目录下会专门有一个 cookie 文件夹来存放各个域下设置的 cookie。当每一次网页要发 http 请求时，浏览器会先检查是否有相应的 cookie，有则自动添加在 request header 中的 cookie 字段中。

存储在 cookie 中的数据，每次都会被浏览器自动放在 http 请求中，如果这些数据并不是每个请求都需要发给服务端的数据，浏览器这设置自动处理无疑增加了网络开销；但如果这些数据是每个请求都需要发给服务端的数据（比如身份认证信息），浏览器这设置自动处理就大大免去了重复添加操作。所以对于那设置“每次请求都要携带的信息（最典型的就是身份认证信息）”就特别适合放在 cookie 中，其他类型的数据就不适合了。

由于 cookie 容易被滥用，所以 cookie 标准做了一些限制：每个域名下的 cookie 的大小最大为 4KB，每个域名下的 cookie 数量最多为 20 个（但很多浏览器厂商在具体实现时支持大于 20 个）。

## cookie 的格式

### document.cookie

JS 原生的 API 提供了获取 cookie 的方法：document.cookie（注意，这个方法只能获取非 HttpOnly 类型的 cookie）。打印出的结果是一个字符串类型，因为 cookie 本身就是存储在浏览器中的字符串。但这个字符串是有格式的，由键值对 key=value 构成，键值对之间由一个分号和一个空格隔开。我们可以自己封装一个方法来获取指定 cookie：

```JavaScript
function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for(let keyvalue of cookies) {
        const [key, value] = keyvalue.split("=");
        if(key === name) {
            return value;
        }
    }
}
```

### cookie 的属性选项

每个 cookie 都有一定的属性，如什么时候失效，要发送到哪个域名，哪个路径等等。这些属性是通过 cookie 选项来设置的，cookie 选项包括：expires、domain、path、secure、HttpOnly。在设置任一个 cookie 时都可以设置相关的这些属性，当然也可以不设置，这时会使用这些属性的默认值。在设置这些属性时，属性之间由一个分号和一个空格隔开。代码示例如下：

```
"key=name; expires=Thu, 25 Feb 2016 04:18:00 GMT; domain=example.com; path=/; secure; HttpOnly"
```

#### expires

expires 选项用来设置“cookie 什么时间内有效”。expires 其实是 cookie 失效日期，expires 必须是 GMT 格式的时间（可以通过 new Date().toGMTString()或者 new Date().toUTCString() 来获得）。

如 expires=Thu, 25 Feb 2016 04:18:00 GMT 表示 cookie 讲在 2016 年 2 月 25 日 4:18 分之后失效，对于失效的 cookie 浏览器会清空。如果没有设置该选项，则默认有效期为 session，即会话 cookie。这种 cookie 在浏览器关闭后就没有了，这里的浏览器指的是浏览器窗口，跟 sessionStorage 类似。

expires 是 http/1.0 协议中的选项，在新的 http/1.1 协议中 expires 已经由 max-age 选项代替，两者的作用都是限制 cookie 的有效时间。expires 的值是一个时间点（cookie 失效时刻= expires），而 max-age 的值是一个以秒为单位时间段（cookie 失效时刻= 创建时刻+ max-age）。

另外，max-age 的默认值是 -1(即有效期为 session )；若 max-age 有三种可能值：负数、0、正数。负数：有效期 session；0：删除 cookie；正数：有效期为创建时刻+ max-age，max-age 的单位为秒。

#### domain 和 path

domain 是域名，path 是路径，两者加起来就构成了 URL，domain 和 path 一起来限制 cookie 能被哪些 URL 访问。

一句话概括：某 cookie 的 domain 为“baidu.com”, path 为“/ ”，若请求的 URL(URL 可以是 js/html/img/css 资源请求，但不包括 XHR 请求)的域名是“baidu.com”或其子域如“api.baidu.com”、“dev.api.baidu.com”，且 URL 的路径是“/ ”或子路径“/home”、“/home/login”，则浏览器会将此 cookie 添加到该请求的 cookie 头部中。

所以 domain 和 path2 个选项共同决定了 cookie 何时被浏览器自动添加到请求头部中发送出去。如果没有设置这两个选项，则会使用默认值。domain 的默认值为设置该 cookie 的网页所在的域名，path 默认值为设置该 cookie 的网页所在的目录。

需要注意的是：

- 发生跨域 xhr 请求时，即使请求 URL 的域名和路径都满足 cookie 的 domain 和 path，默认情况下 cookie 也不会自动被添加到请求头部中。
- omain 是可以设置为页面本身的域名（本域），或页面本身域名的父域，但不能是公共后缀 public suffix。举例说明下：如果页面域名为 www.baidu.com, domain 可以设置为“www.baidu.com”，也可以设置为“baidu.com”，但不能设置为“.com”或“com”。

#### secure

secure 选项用来设置 cookie 只在确保安全的请求中才会发送。当请求是 HTTPS 或者其他安全协议时，包含 secure 选项的 cookie 才能被发送至服务器。

默认情况下，cookie 不会带 secure 选项(即为空)。所以默认情况下，不管是 HTTPS 协议还是 HTTP 协议的请求，cookie 都会被发送至服务端。但要注意一点，secure 选项只是限定了在安全情况下才可以传输给服务端，但并不代表你不能看到这个 cookie。

需要注意的是：

- 如果想在客户端即网页中通过 js 去设置 secure 类型的 cookie，必须保证网页是 https 协议的。在 http 协议的网页中是无法设置 secure 类型 cookie 的。

#### httpOnly
这个选项用来设置cookie是否能通过 js 去访问。默认情况下，cookie不会带httpOnly选项(即为空)，所以默认情况下，客户端是可以通过js代码去访问（包括读取、修改、删除等）这个cookie的。当cookie带httpOnly选项时，客户端则无法通过js代码去访问（包括读取、修改、删除等）这个cookie。

在客户端是不能通过js代码去设置一个httpOnly类型的cookie的，这种类型的cookie只能通过服务端来设置。

httpOnly是为了保障安全，如果任何 cookie 都能被客户端通过document.cookie获取会发生什么可怕的事情。当我们的网页遭受了 XSS 攻击，有一段恶意的script脚本插到了网页中。这段script脚本做的事情是：通过document.cookie读取了用户身份验证相关的 cookie，并将这些 cookie 发送到了攻击者的服务器。攻击者轻而易举就拿到了用户身份验证信息，于是就可以摇摇大摆地冒充此用户访问你的服务器了（因为攻击者有合法的用户身份验证信息，所以会通过你服务器的验证）。

## 如何设置 cookie？
设置 cookie分两种情况，既可以由服务端来设置，也可以由客户端来设置。

### 服务端设置 cookie
不管是请求一个资源文件（如 html/js/css/图片），还是发送一个ajax请求，服务端都会返回response。而response header中有一项叫set-cookie，是服务端专门用来设置cookie的。服务端返回的response header可以有多个set-cookie字段，每个字段对应一个cookie（注意不能将多个cookie放在一个set-cookie字段中），set-cookie字段的值就是普通的字符串，每个cookie还可以设置相关属性选项。

需要注意的是：
- 一个set-Cookie字段只能设置一个cookie，当你要想设置多个 cookie，需要添加同样多的set-Cookie字段。
- 服务端可以设置cookie 的所有选项：expires、domain、path、secure、HttpOnly

### 客户端设置 cookie
在网页即客户端中我们也可以通过js代码来设置cookie，方法很简单：
```JavaScript
document.cookie = "name=Jonh; ";
```
或者进行更多设置
```JavaScript
document.cookie="age=12; expires=Thu, 26 Feb 2116 11:50:25 GMT; domain=sankuai.com; path=/";
```
需要注意的是：
- 客户端可以设置cookie 的下列选项：expires、domain、path、secure（有条件：只有在https协议的网页中，客户端设置secure类型的 cookie 才能成功），但无法设置HttpOnly选项。

当要设置多个cookie时，不能同时设置，而需要重复执行：
```JavaScript
document.cookie = "name=Jonh";
document.cookie = "age=12";
document.cookie = "class=111";
```

## 修改 cookie
要想修改一个cookie，只需要重新赋值就行，旧的值会被新的值覆盖。但要注意一点，在设置新cookie时，path/domain这几个选项一定要旧cookie 保持一样。否则不会修改旧值，而是添加了一个新的 cookie。

## 删除 cookie
删除一个cookie 也挺简单，也是重新赋值，只要将这个新cookie的expires 选项设置为一个过去的时间点就行了。但同样要注意，path/domain/这几个选项一定要旧cookie 保持一样。

## cookie 编码
cookie其实是个字符串，但这个字符串中逗号、分号、空格被当做了特殊符号。所以当cookie的 key 和 value 中含有这3个特殊字符时，需要对其进行额外编码，可以用encodeURIComponent/decodeURIComponent或者encodeURI/decodeURI。

## 跨域请求中 cookie
需要额外设置，详见 跨域

## 补充
- 什么时候 cookie 会被覆盖：name/domain/path 这3个字段都相同的时候。
- 关于domain的补充说明：
  - 如果显式设置了 domain，则设置成什么，浏览器就存成什么；但如果没有显式设置，则浏览器会自动取 url 的 host 作为 domain 值。
  - 新的规范中，显式设置 domain 时，如果 value 最前面带点，则浏览器处理时会将这个点去掉，所以最后浏览器存的就是没有点的（注意：但目前大多数浏览器并未全部这么实现）。
  - 前面带点‘.’和不带点‘.’有啥区别：
    - 带点：任何 subdomain 都可以访问，包括父 domain
    - 不带点：只有完全一样的域名才能访问，subdomain 不能（但在 IE 下比较特殊，它支持 subdomain 访问）


## 参考
- [cookie详解](https://blog.csdn.net/playboyanta123/article/details/79464684)
- [Cookie/Session 的机制与安全](https://harttle.land/2015/08/10/cookie-session.html)