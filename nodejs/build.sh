#!/bin/bash

UI_SRC_PATH=/home/myname/myuisrc
export VITE_BASE_URL='http://172.16.160.33:48080'
export VITE_OUT_DIR=/home/myname/app/myuiprod

export VITE_APP_TITLE=我的网站名
export VITE_OPEN=false
export VITE_APP_TENANT_ENABLE=true

# 验证码的开关
export VITE_APP_CAPTCHA_ENABLE=false

# 文档地址的开关
export VITE_APP_DOCALERT_ENABLE=false

# 百度统计
# export VITE_APP_BAIDU_CODE=a1ff8825baa73c3a78eb96aa40325abc

# 默认账户密码
export VITE_APP_DEFAULT_LOGIN_TENANT=我的公司名
export VITE_APP_DEFAULT_LOGIN_USERNAME=admin
export VITE_APP_DEFAULT_LOGIN_PASSWORD=admin123

echo "VITE_OUT_DIR:$VITE_OUT_DIR"
echo "VITE_APP_TITLE:$VITE_APP_TITLE"

npm --prefix ${UI_SRC_PATH} run build:prod

################################################################

# 下载依赖
# 安装 pnpm，提升依赖的安装速度
npm config set registry https://registry.npmmirror.com
npm install -g pnpm
# 安装依赖
pnpm install

# 调试运行
# vim .env.loacl OR export VITE_BASE_URL='http://172.16.160.33:48080'
npm run dev -- --port 8000
