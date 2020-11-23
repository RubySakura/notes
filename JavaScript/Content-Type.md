# Content-Type

Content-Type 实体头部用于指示资源的 MIME 类型 media type 。

在响应中，Content-Type 标头告诉客户端实际返回的内容的内容类型。浏览器会在某些情况下进行 MIME 查找，并不一定遵循此标题的值; 为了防止这种行为，可以将标题 X-Content-Type-Options 设置为 nosniff。

在请求中，客户端告诉服务器实际发送的数据类型。

## 句法

```
Content-Type: text/html; charset=utf-8
Content-Type: multipart/form-data; boundary=something
```

## 指令

- media-type  
  资源或数据的 MIME type 。

- charset  
  字符编码标准。

- boundary  
  对于多部分实体 boundary 是必需的，其包括来自一组字符的 1 到 70 个字符，它用于封装消息的多个部分的边界。

## 请求

### GET

GET 的情况比较简单，无论是 AJAX 还是 form 表单，浏览器都是用 x-www-form-urlencoded 的编码方式把数据转换成一个字串（name1=value1&name2=value2...），然后把这个字串 append 到 URL 后面，用?分割，然后请求该 URL。  
由于 GET 的请求体里没有数据，所以不需要在 header 里通过 Content-Type 声明请求体类型。

### POST

在通过 HTML form 提交生成的 POST 请求中，请求头的 Content-Type 由 form 元素上的 enctype 属性指定。  
在通过 Ajax 发送的 POST 请求中，通过设置请求的 header 指定。

#### application/json

application/json 是最常使用的请求体类型。

#### form-data 和 x-www-form-urlencoded 的区别

[post 使用 form-data 和 x-www-form-urlencoded 的本质区别](https://blog.csdn.net/u013827143/article/details/86222486)

application/x-www-form-urlencoded 是 form 中 post 的默认格式，使用 js 中 URLencode 转码方法。包括将 name、value 中的空格替换为加号；将非 ascii 字符做百分号编码；将 input 的 name、value 用‘=’连接，不同的 input 之间用‘&’连接。  
同样使用 URLencode 转码，这种 post 格式跟 get 的区别在于，get 把转换、拼接完的字符串用‘?’直接与表单的 action 连接作为 URL 使用，所以请求体里没有数据；而 post 把转换、拼接后的字符串放在了请求体里，不会在浏览器的地址栏显示，因而更安全一些。  
对于一段 utf8 编码的字节，用 application/x-www-form-urlencoded 传输其中的 ascii 字符没有问题，但对于非 ascii 字符传输效率就很低了，因此在传很长的字节（如文件）时应用 multipart/form-data 格式。  
当使用 multipart/form-data 格式时，multipart/form-data 将表单中的每个 input 转为了一个由 boundary 分割的小格式，没有转码，直接将 utf8 字节拼接到请求体中，在本地有多少字节实际就发送多少字节，极大提高了效率，适合传输长字节。

## 响应

常见的媒体格式类型如下：

- text/html ： HTML 格式
- text/plain ：纯文本格式
- text/xml ： XML 格式
- image/gif ：gif 图片格式
- image/jpeg ：jpg 图片格式
- image/png：png 图片格式

以 application 开头的媒体格式类型：

- application/xhtml+xml ：XHTML 格式
- application/xml ： XML 数据格式
- application/atom+xml ：Atom XML 聚合格式
- application/json ： JSON 数据格式
- application/pdf ：pdf 格式
- application/msword ： Word 文档格式
