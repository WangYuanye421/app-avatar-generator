# AI 靓仔头像生成器

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/text-to-image-template)

![AI 靓仔头像生成器预览](https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/dddfe97e-e689-450b-d5a9-d49801da6a00/public)

<!-- dash-content-start -->

使用 [Workers AI](https://developers.cloudflare.com/workers-ai/) 技术，根据文字描述生成个性化头像。用户可以选择多种艺术风格，包括二头身、像素艺术、赛博朋克、奇幻、蒸汽朋克、动漫、数字艺术、漫画书、3D模型和摄影等风格，也可以选择无风格自由描述模式。应用会将中文描述翻译成英文后生成高质量的头像图片。

<!-- dash-content-end -->

## 功能特点

- 多种艺术风格选择：支持10+种不同的艺术风格
- 智能描述生成：内置随机描述生成功能，提供灵感
- 中英文双语支持：自动将中文描述翻译为英文以获得更好的生成效果
- 响应式设计：适配各种设备屏幕尺寸
- 风格预览：每个风格都有示例图片预览
- 一键下载：生成的头像可直接下载保存
- 分享功能：支持分享应用给朋友
- 使用限制：为防止滥用，设置了每日使用次数限制

## 技术架构

本项目基于 Cloudflare Workers 构建，使用了以下技术和服务：

- Cloudflare Workers：应用运行平台
- Cloudflare AI：提供图像生成和语言处理能力
- Cloudflare KV：存储使用统计信息
- TypeScript：类型安全的 JavaScript 超集
- Wrangler：Cloudflare Workers 开发工具

## 快速开始

1. 克隆项目代码：
   ```bash
   git clone <项目地址>
   cd app-avatar-generator
   ```
2. 安装项目依赖：
   ```bash
   npm install
   ```
3. 启动开发服务器：
   ```bash
   npm run dev
   ```
4. 部署到 Cloudflare：
   ```bash
   npm run deploy
   ```

## 使用说明

1. 选择艺术风格：从下拉菜单中选择喜欢的风格，或选择"无风格，自由描述"模式
2. 输入描述：在文本框中输入想要生成的头像描述，或者点击"随机"按钮获取灵感
3. 生成头像：点击"生成"按钮，等待几秒钟即可看到生成的头像
4. 下载保存：点击头像右上角的下载按钮保存图片
5. 分享应用：点击右上角的分享按钮将应用分享给朋友

## API 接口

应用提供以下 API 接口：

- `/api/generate`：生成头像图片
- `/api/random-prompt`：生成随机描述
- `/api/image-proxy`：图片代理服务

## 配置说明

应用支持以下环境变量配置：

- `MAX_REQUESTS_PER_DAY`：每个IP每日最大请求次数
- `MAX_RANDOM_DESC_PER_DAY`：每个IP每日随机描述生成次数

## 注意事项

- 图像生成需要几秒钟时间，请耐心等待
- 为防止滥用，设置了每日使用次数限制
- 生成的头像为1:1比例，适合用作头像
- 应用会自动将中文描述翻译为英文以提高生成质量
