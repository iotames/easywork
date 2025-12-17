## 更改鼠标右键的上下文菜单

1. 按下 `Win+R` 键，输入 `regedit`，按回车打开注册表编辑器
2. 找到注册表项位置

```bash
# 桌面右键菜单
计算机\HKEY_CLASSES_ROOT\Directory\Background\shellex\ContextMenuHandlers
# 通过 Code 打开
计算机\HKEY_CLASSES_ROOT\Directory\Background\shell\VSCode

# 文件右键菜单
计算机\HKEY_CLASSES_ROOT\*\shellex\ContextMenuHandlers
# 通过 Code 打开
计算机\HKEY_CLASSES_ROOT\*\shell\VSCode

# 文件夹右键菜单
计算机\HKEY_CLASSES_ROOT\Directory\shellex\ContextMenuHandlers
# 通过 Code 打开
计算机\HKEY_CLASSES_ROOT\Directory\shell\VSCode
```
