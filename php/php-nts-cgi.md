---
lang: zh-CN
title: PHP下载:关于TS和NTS版本与运行模式
---

## 背景

查看某个PHP项目，vs配置PHP解释器以便追踪代码，得先下载并安装PHP运行环境。
通过网页请求接口，查看HTTP响应头包含PHP版本如下所示:

```
X-Powered-By: PHP/7.4.12
```


## 官方下载

PHP官方下载地址: https://www.php.net/downloads
主页都是PHP8的下载链接。早期的PHP版本的下载地址如下:

- Linux

点击下载主页右侧 [Old archives](https://www.php.net/releases/) 下载: https://www.php.net/releases/

- Windows

点击下载主页任意PHP版本下的 [Windows downloads](https://windows.php.net/download) 链接，
跳转后，点击 [Past releases](https://windows.php.net/downloads/releases/archives/): https://windows.php.net/downloads/releases/archives/

- 版本选择
[Windows downloads](https://windows.php.net/download) 左侧有关于 `Which version do I choose?` 的介绍


## NTS和TS版本

### NTS(non-thread-safe)

非线程安全。在执行时不进行线程（thread）安全检查

以下情况使用 `NTS(non-thread-safe)` 版本:

1. `PHP-FPM` 运行模式(比如搭配Nginx或者Apache的 `mod_fastcgi` )
2. `PHP-CGI` (比如搭配Apache的 `mod_fcgid` 或者Win上的IIS)来运行PHP

以 `FAST-CGI` 或 `PHP-FPM` 方式运行就用 `NTS` 非线程安全版

### TS(thread-safe)

线程安全。执行时会进行线程（thread）安全检查，防止有新要求就启动新线程的 CGI 执行方式耗尽系统资源

以下情况使用 `TS(thread-safe)` 版本:

1. 使用 `pthreads` 这个多线程的PECL扩展
2. PHP以 `MOD_PHP` 嵌入多线程运行下的Apache。比如Apache在Linux上提供的 `Event MPM` 就是一个多进程多线程的工作模型,Windows上Apache采用的 `WinNT MPM` 也是一个多线程模型
3. windows系统下，Apache(IIS) + PHP 组合，以 `ISAPI` 的方式运行

在PHP5.3以后，PHP不再有ISAPI模式，安装后也不再有php5isapi.dll这个文件。要在IIS6上使用高版本PHP，必须安装FastCGI 扩展，然后使IIS6支持FastCGI。

### 总结

- Apache + PHP，PHP一般作为Apache的模块进行运行 选TS
- 以 ISAPI 方式运行就用 TS
- Nginx + PHP ，（以php-fpm的方式运行）选NTS
- IIS（fast-cgi） + PHP 选NTS


## PHP的运行模式

- `CGI` (通用网关接口/Common Gateway Interface)：CGI就象是一座桥，把网页和WEB服务器中的执行程序连接起来，它把HTML接收的指令传递给服务器的执行程序，再把服务器执行程序的结果返还给HTML页。CGI 的跨平台性能极佳，几乎可以在任何操作系统上实现。`CGI`方式在遇到连接请求（用户 请求）先要创建cgi的子进程，激活一个CGI进程，然后处理请求，处理完后结束这个子进程。
- `FAST CGI` (常驻型CGI / Long-Live CGI)：FAST-CGI 是微软为了解决 CGI 解释器的不足而提出改进方案。是cgi的升级版本，FastCGI像是一个常驻(long-live)型的`CGI`，它可以一直执行着，只要激活后，不会每次都要花费时间去fork一 次。PHP使用 `PHP-FPM`(FastCGI Process Manager)，全称 `PHP FastCGI进程管理器` 进行管理。当一个请求执行完毕后不会注销该进程，而是将改进程进入休眠期，当接收到新的请求时，重新启用改进程进行处理。`FAST-CGI` 较CGI 减少了进程的重复创建的资源占用。
- `CLI`（命令行运行 / Command Line Interface）：PHP在命令行运行的接口，区别于在Web服务器上运行的PHP环境（PHP-CGI，ISAPI等）
- `模块模式`：以 `mod_php5` 模块的形式集成
- `ISAPI`(Internet Server Application Programming Interface): 通常是指被http服务器所加载，以服务器的模块形式运行，由微软提出，故只能在win平台上运行。例如win下的apache,iis。
- `PHP-FPM`(PHP-Fastcgi Process Manager): `php-fpm` 是 `FastCGI` 的实现，并提供了进程管理的功能。


## LANMP环境搭建

网上有无数文章，介绍各种LANMP环境的搭建，这边选择最经典的一篇。被抄袭了无数遍。现已不好追踪原创到底是谁了。
经典不是说永远都可以实操，而是各种概念和原理，介绍得很详细，研究透了，可以举一反三。

下面这些文章都出自同一篇:

- 2020-08-17 [Centos7 LANMP环境搭建](https://segmentfault.com/a/1190000023652154) segmentfault

- 2020-09-30 [PHP安装包TS和NTS的区别-Centos7 LANMP环境搭建(最完善版本)](https://www.cnblogs.com/lxwphp/p/15452698.html) cnblogs

- 2021-06-23 [PHP安装包TS和NTS的区别-Centos7 LANMP环境搭建(最完善版本)](https://blog.51cto.com/lxw1844912514/2941227) 51cto

- 2022-2-17 [PHP安装包TS和NTS的区别-Centos7 LANMP环境搭建(最完善版本)](https://javaforall.cn/111671.html) javaforall.cn

- 2022-07-18 [PHP安装包TS和NTS的区别-Centos7 LANMP环境搭建(最完善版本)](https://cloud.tencent.com/developer/article/2051204) cloud.tencent.com

- 2022-10-24 [PHP安装包TS和NTS的区别-Centos7 LANMP环境搭建(最完善版本)](http://www.manongjc.com/detail/63-yoogiwevvmtctyz.html) www.manongjc.com


----------

> PHP 的 NTS 和 TS 之间的区别？ https://www.php.cn/faq/456097.html