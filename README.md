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

### env

```sh
# 创建.env文件
cp .env.example .env
```

## 配置文件说明

```sh
...
```
