const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const ora = require('ora');
// 加载 .env 文件中的环境变量
require('dotenv').config({path: '.env'});

const HF_AUTH_TOKEN = process.env.HF_AUTH_TOKEN;
const MODEL_SIZE = process.env.MODEL_SIZE;
const USE_MIRROR = process.env.USE_MIRROR;
const USE_WEBGPU = process.env.USE_WEBGPU;
// Hugging Face 的基础 URL
const BASE_URL = USE_MIRROR ? 'https://hf-mirror.com' : 'https://huggingface.co';

// 下载文件的任务
async function downloadFile(url, dest) {
    // 在每次调用时导入 fetch
    const {default: fetch} = await import('node-fetch');
    const headers = HF_AUTH_TOKEN ? {Authorization: `Bearer ${HF_AUTH_TOKEN}`} : {};
    const response = await fetch(url, {headers, timeout: 1000 * 60 * 60});

    if (!response.ok) {
        throw new Error(`Failed to download ${url}: ${response.statusText}`);
    }

    const fileStream = fs.createWriteStream(dest);
    return new Promise((resolve, reject) => {
        response.body.pipe(fileStream);
        response.body.on('error', reject);
        fileStream.on('finish', resolve);
    });
}

// Gulp 任务：下载模型文件
gulp.task('fetch-model', async () => {
    // 模型名称
    const modelName = `onnx-community/Qwen2.5-${MODEL_SIZE}B-Instruct`;
    // 下载目录
    const destDir = './src/ai/model/qwen';
    // 要下载的文件
    const files = [
        'config.json',
        'tokenizer.json',
        'tokenizer_config.json',
        'vocab.json',
        'special_tokens_map.json',
        'generation_config.json',
        'onnx/model_quantized.onnx',
    ];

    if (USE_WEBGPU) {
        files.push('onnx/model_fp16.onnx');
    }

    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, {recursive: true});
        fs.mkdirSync(path.join(destDir, 'onnx'), {recursive: true});
    }

    const spinner = ora('Downloading model files\n').start();

    // 并行下载文件
    const downloadPromises = files.map(async (file, index) => {
        const url = `${BASE_URL}/${modelName}/resolve/main/${file}`;
        const destPath = path.join(destDir, file);
        const fileSpinner = ora(`Downloading ${file}...\n`).start();

        try {
            await downloadFile(url, destPath);
            fileSpinner.succeed(`Downloaded: ${file}\n`);
        }
        catch (error) {
            fileSpinner.fail(`Failed to download ${file}: ${error.message}\n`);
        }
    });

    await Promise.all(downloadPromises);

    spinner.succeed('Download completed\n');
});
