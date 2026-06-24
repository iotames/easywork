## 脚本示例

1. 根据客户端访问IP地址判断是否为德国访问，是则重定向跳转到德国站。

```javascript
<script type="module">
fetch("https://ipapi.co/json").then(function(n){return n.json()}).then(function(n){"DE"==n.country?window.location.href="http://santic-europe.com":(window.navigator.userLanguage||window.navigator.language).indexOf("de")>-1&&(window.location.href="http://santic-europe.com")})
</script>
```
