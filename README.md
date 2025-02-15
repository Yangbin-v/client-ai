# client-ai

在浏览器运行模型的demo

### 模型文件

- 模型文件在 `src/ai/model` 目录下
- deepSeek-distill-qwen 对应 https://huggingface.co/onnx-community/DeepSeek-R1-Distill-Qwen-1.5B-ONNX
- qwen 对应 https://huggingface.co/onnx-community/Qwen2.5-0.5B-Instruct/tree/main

去上面的链接下载对应的模型文件，然后放到 `src/ai/model` 目录下

### 启动

运行下面2个命令就可以启动demo
```sh
npm install
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
