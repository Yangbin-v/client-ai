# oh-my-clone

端侧AI的实践

## 开发命令

### 配置 env
安装说明填写 env 配置
```sh
cp .env.example .env
```

```env
# HuggingFace Access Token，用来下载模型
HF_AUTH_TOKEN=xxxxxxxxxxxx

# Model Size，模型大小，0.5和1.5B的模型
MODEL_SIZE=0.5

# 下载模型需要代理，如果没有VPN，是否使用镜像
# USE_MIRROR=1

```

### 启动

```sh
npm run bootstrap
npm run dev
```

### 构建

```sh
npm run build
```

## 配置文件说明

```sh
.browserlistrc   # 转译的目标浏览器范围，会被 Babel、PostCSS 等工具依赖
.eslintrc.js     # ESLint 配置，默认启用 @ecomfe/eslint-config 并开启 Vue/TS 支持
.stylelintrc     # Stylelint 配置，默认启用 @ecomfe/stylelint-config
.huskyrc         # Husky 配置，默认在 git commit 时调起 lint-staged
.lintstagedrc    # lint-staged 配置，默认在 git commit 前修正代码风格问题
babel.config.js  # Babel 配置，Vue CLI 默认生成
vue.config.js    # Vue CLI 配置，默认开启了 Less 的内联 JS 功能
```
