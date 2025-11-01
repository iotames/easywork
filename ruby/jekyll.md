## Jekyll on Windows

Windows 不是一个官方支持的平台，但通过适当的调整，它也可以用来运行 Jekyll。

推荐使用Linux 或 MacOS 来运行 Jekyll

1. 下载并安装一个 Ruby+Devkit 版本（3.2.5）：https://rubyinstaller.org/downloads/archives/

2. Ruby安装的最后一步，允许 `ridk install`。安装MSYS2记得选择 `第3个` 完整环境：`MSYS2 and MINGW development toolchain`

3. 使用国内镜像源

```bash
# 移除默认源
gem sources --remove https://rubygems.org/
# 添加国内镜像源，例如Ruby China的源
gem sources --add https://gems.ruby-china.com/
# 查看当前源，确认已更新
gem sources -l
```

4. 安装 `bundler` 包依赖管理和 `Jekyll`：`gem install bundler jekyll`

5. 实时重载调试: `jekyll serve --watch`

6. 安装主题： `_config.yml` 配置的 `theme`，本地需要安装才能使用。例：`gem install minima`


## Jekyll 命令

```bash
# 开启本地服务调试：http://localhost:4000
# jekyll s
jekyll serve

#实时重载调试 jekyll s -w
jekyll serve --watch

# 查看详细输出信息
jekyll serve --verbose

# 仅构建静态页面 jekyll b
jekyll build
```

## 注意事项

markdown类型的链接跳转会有问题。


-------------

> https://jekyllrb.com/docs/installation/windows/
> https://jekyllrb.com/docs/usage/