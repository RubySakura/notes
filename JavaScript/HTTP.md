# HTTP

（待补充）

HTTP2和HTTP1有什么区别
相对于HTTP1.0，HTTP1.1的优化：

- 缓存处理：多了Entity tag，If-Unmodified-Since, If-Match, If-None-Match等缓存信息（HTTTP1.0 If-Modified-Since,Expires）
- 带宽优化及网络连接的使用
- 错误通知的管理
- Host头处理
- 长连接： HTTP1.1中默认开启Connection： keep-alive，一定程度上弥补了HTTP1.0每次请求都要创建连接的缺点。

相对于HTTP1.1，HTTP2的优化：

- HTTP2支持二进制传送（实现方便且健壮），HTTP1.x是字符串传送
- HTTP2支持多路复用
- HTTP2采用HPACK压缩算法压缩头部，减小了传输的体积
- HTTP2支持服务端推送
