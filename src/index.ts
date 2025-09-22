import { appConfig } from './config';

interface Env {
	AI: Ai;
	RATE_LIMITER: KVNamespace;
	RANDOM_DESC_LIMITER: KVNamespace;
	MAX_REQUESTS_PER_DAY: string;
	MAX_RANDOM_DESC_PER_DAY: string;
}

// 从配置中提取风格描述映射
const styleDescriptions: Record<string, string> = {};
appConfig.styles.forEach(style => {
	styleDescriptions[style.value] = style.description;
});

const html = `
<!DOCTYPE html>
<html>
<head>
	<title>AI 靓仔头像</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<style>
		:root {
			--primary-color: #6366F1;
			--primary-light: #818CF8;
			--primary-dark: #4F46E5;
			--secondary-color: #10B981;
			--background-dark: #f3e6f0;
			--background-light: #f2f1ea;
			--text-primary: #1f2937;
			--text-secondary: #4b5563;
			--card-bg: #ffffff;
			--border-color: #e0e0e0;
		}
		html, body {
			height: 100%;
			margin: 0;
		}
		body {
			font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
			background: linear-gradient(135deg, #f3e6f0, #f2f1ea);
			color: var(--text-primary);
			min-height: 100vh;
			height: 100%;
			overflow: hidden;
		}
		.app-layout {
			display: flex;
			flex-direction: column;
			height: 100vh;
			max-width: 1200px;
			margin: 0 auto;
			padding: 1rem;
			box-sizing: border-box;
		}
		.app-header {
			text-align: center;
			padding: 1rem;
			margin-bottom: 1rem;
			flex-shrink: 0;
		}
		.app-header h1 {
			font-size: 1.8rem;
			margin: 0;
			background: linear-gradient(to right, #ff00c7, #ff9900);
			-webkit-background-clip: text;
			background-clip: text;
			color: transparent;
			font-weight: 700;
		}
		.controls-section {
			background-color: var(--card-bg);
			border-radius: 1rem;
			padding: 0.75rem;
			margin-bottom: 0.75rem;
			box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
			border: 1px solid var(--border-color);
			flex-shrink: 0;
		}
		.input-grid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 0.75rem;
			margin-bottom: 0.75rem;
		}
		.input-group label {
			display: block;
			margin-bottom: 0.75rem;
			font-weight: 500;
			font-size: 1rem;
			color: var(--text-secondary);
		}
		.label-with-button {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		.inline-random-btn {
			margin-right: 0.5rem;
		}
		.style-description {
			font-size: 0.85rem;
			color: #888;
			margin-top: 0.5rem;
			min-height: 2.5em;
		}
		select, input, textarea {
			width: 100%;
			padding: 0.85rem 1rem;
			border-radius: 0.75rem;
			border: 1px solid var(--border-color);
			background-color: rgba(255, 255, 255, 0.7);
			color: var(--text-primary);
			font-size: 1rem;
			box-sizing: border-box;
			transition: all 0.2s ease;
		}
		select:focus, input:focus, textarea:focus {
			outline: none;
			border-color: var(--primary-color);
			box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
		}
		textarea {
			min-height: 80px;
			resize: vertical;
		}
		.inline-random-btn {
			background: rgba(255, 255, 255, 0.7);
			color: var(--text-secondary);
			border: 1px solid var(--border-color);
			border-radius: 0.5rem;
			padding: 0.25rem 0.5rem;
			font-size: 0.85rem;
			cursor: pointer;
			transition: all 0.2s ease;
			margin-right: 0.5rem;
			width: auto;
			min-width: 60px;
		}
		.inline-random-btn:hover {
			background: rgba(240, 240, 240, 0.7);
			color: var(--text-primary);
		}
		.button-grid {
			display: grid;
			grid-template-columns: 1fr;
			gap: 0.75rem;
			flex-shrink: 0;
		}
		button {
			width: 100%;
			padding: 1rem 1.25rem;
			border-radius: 0.75rem;
			border: none;
			cursor: pointer;
			font-weight: 600;
			font-size: 1.1rem;
			box-sizing: border-box;
			transition: all 0.2s ease;
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 0.75rem;
		}
		button:active { transform: scale(0.98); }
		#generate-btn {
			background: linear-gradient(to right, #ff00c7, #ff9900);
			color: white;
			box-shadow: 0 4px 15px rgba(255, 0, 199, 0.3);
		}
		#generate-btn:hover { 
			background: linear-gradient(to right, #e000b0, #e68a00);
			box-shadow: 0 6px 20px rgba(255, 0, 199, 0.4);
		}
		.preview-section {
			flex: 2;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 1rem;
			overflow: hidden;
		}
		.image-container {
			width: 100%;
			max-width: 100%;
			text-align: center;
			flex: 2;
			display: flex;
			flex-direction: column;
			min-height: 0;
		}
		.image-wrapper {
			position: relative;
			display: flex;
			width: 100%;
			border-radius: 1rem;
			overflow: hidden;
			box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
			border: 1px solid var(--border-color);
			background-color: var(--card-bg);
			min-height: 320px;
			height: 100%;
			max-height: 320px;
			align-items: center;
			justify-content: center;
			flex: 1;
		}
		.image-content {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.placeholder-text {
			color: var(--text-secondary);
			font-size: 1rem;
			padding: 1rem;
		}
		img {
			max-width: 100%;
			max-height: 100%;
			display: block;
			object-fit: contain;
		}
		.hidden { display: none; }
		.spinner {
			width: 50px;
			height: 50px;
			border: 5px solid rgba(255, 0, 199, 0.2);
			border-top: 5px solid #ff00c7;
			border-radius: 50%;
			animation: spin 1s linear infinite;
		}
		@keyframes spin { 
			0% { transform: rotate(0deg); } 
			100% { transform: rotate(360deg); } 
		}
		.download-btn {
			position: absolute;
			top: 16px;
			right: 16px;
			width: 48px;
			height: 48px;
			border-radius: 50%;
			background-color: rgba(255, 255, 255, 0.8);
			color: var(--text-primary);
			padding: 0;
			border: 1px solid var(--border-color);
			backdrop-filter: blur(4px);
		}
		.download-btn:hover { 
			background-color: rgba(240, 240, 240, 0.9);
			transform: scale(1.05);
		}
		#share-app-btn {
			position: fixed;
			bottom: 1.5rem;
			right: 1.5rem;
			width: 60px;
			height: 60px;
			border-radius: 50%;
			background: linear-gradient(to right, #ff00c7, #ff9900);
			color: white;
			box-shadow: 0 6px 20px rgba(255, 0, 199, 0.4);
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			border: none;
			transition: all 0.2s ease;
		}
		#share-app-btn:hover { 
			transform: scale(1.1);
			box-shadow: 0 8px 25px rgba(255, 0, 199, 0.5);
		}
		button svg { 
			stroke: currentColor; 
			width: 24px;
			height: 24px;
		}
		.footer {
			text-align: center;
			padding: 1.5rem;
			color: var(--text-secondary);
			font-size: 0.9rem;
		}
		@media (max-width: 768px) {
			.input-grid {
				grid-template-columns: 1fr;
			}
			.button-grid {
				grid-template-columns: 1fr;
			}
			.app-header h1 {
				font-size: 1.5rem;
			}
		}
	</style>
</head>
<body>
	<div class="app-layout">
		<header class="app-header">
			<h1>AI 靓仔头像</h1>
		</header>

		<section class="controls-section">
			<div class="input-grid">
				<div class="input-group">
					<label for="style">风格</label>
					<select id="style">
						${appConfig.styles.map(style => `<option value="${style.value}">${style.label}</option>`).join('')}
					</select>
					<div id="style-description" class="style-description">${appConfig.styles[0].description}</div>
				</div>
				<div class="input-group">
					<div class="label-with-button">
						<label for="prompt" class="label-text">描述</label>
						<button id="inline-random-btn" class="inline-random-btn">🎲 随机</button>
					</div>
					<textarea id="prompt" placeholder="例如：骑士, 宝剑..."></textarea>
				</div>
			</div>
			
			<section class="preview-section">
				<div class="image-container">
					<div class="image-wrapper">
						<div id="placeholder" class="placeholder-text">生成的头像将显示在这里</div>
						<div id="spinner" class="spinner hidden"></div>
						<div class="image-content hidden">
							<img id="image" src="" alt="生成的头像">
							<button id="download-btn" class="download-btn" title="下载图片"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></button>
						</div>
					</div>
				</div>
			</section>
			
			<div class="button-grid">
				<button id="generate-btn"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> 生成</button>
			</div>
		</section>

		<button id="share-app-btn" title="分享应用"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg></button>

	<script>
		const resultDiv = document.getElementById('result');
		const spinner = document.getElementById('spinner');
		const imageWrapper = document.querySelector('.image-wrapper');
		const imageContent = document.querySelector('.image-content');
		const image = document.getElementById('image');
		const downloadBtn = document.getElementById('download-btn');
		const shareBtn = document.getElementById('share-app-btn');
		const placeholder = document.getElementById('placeholder');
		
		const styleSelect = document.getElementById('style');
		const promptInput = document.getElementById('prompt');
		const generateBtn = document.getElementById('generate-btn');
		const inlineRandomBtn = document.getElementById('inline-random-btn');
		const styleDescription = document.getElementById('style-description');

		let imageUrl = '';

		// 风格描述映射
		const styleDescriptions = ${JSON.stringify(styleDescriptions)};

		// 更新风格描述
		function updateStyleDescription() {
			const selectedStyle = styleSelect.value;
			styleDescription.textContent = styleDescriptions[selectedStyle] || '';
		}

		// 初始化风格描述
		updateStyleDescription();

		// 风格选择变化时更新描述
		styleSelect.addEventListener('change', updateStyleDescription);

		generateBtn.addEventListener('click', async () => {
			const style = styleSelect.value;
			const prompt = promptInput.value || 'random';
			const fullPrompt = style + ' style, ' + prompt;
			await generateImage(fullPrompt);
		});

		// 新增的行内随机按钮事件
		inlineRandomBtn.addEventListener('click', async (e) => {
			e.preventDefault();
			const style = styleSelect.value;
			inlineRandomBtn.disabled = true;
			inlineRandomBtn.textContent = '生成中...';
			
			try {
				const response = await fetch('/api/random-prompt', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ style }),
				});
				
				if (response.ok) {
					const data = await response.json();
					const prompt = data.prompt;
					promptInput.value = prompt;
				} else if (response.status === 429) {
					const error = await response.json();
					alert(error.error || '已超出随机描述生成次数限制，请明天再试。');
				} else {
					const error = await response.json();
					alert(error.error || '生成提示词时出错');
				}
			} catch (err) {
				console.error(err);
				alert('生成提示词时发生错误。');
			} finally {
				inlineRandomBtn.disabled = false;
				inlineRandomBtn.innerHTML = '🎲 随机';
			}
		});

		async function generateImage(prompt) {
			placeholder.classList.add('hidden');
			spinner.classList.remove('hidden');
			imageContent.classList.add('hidden');

			try {
				const response = await fetch('/api/generate', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ prompt }),
				});

				if (response.ok) {
					const blob = await response.blob();
					imageUrl = URL.createObjectURL(blob);
					image.src = imageUrl;
					imageContent.classList.remove('hidden');
				} else if (response.status === 429) {
					const error = await response.json();
					alert(error.error || '已超出使用次数限制，请明天再试。');
				} else {
					const error = await response.json();
					alert(error.error);
				}
			} catch (err) {
				console.error(err);
				alert('生成图片时发生错误。');
			} finally {
				spinner.classList.add('hidden');
			}
		}

		downloadBtn.addEventListener('click', () => {
			const a = document.createElement('a');
			a.href = imageUrl;
			a.download = 'avatar.png';
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		});

		shareBtn.addEventListener('click', () => {
			if (navigator.share) {
				navigator.share({
					title: 'AI 头像生成器',
					text: '快来看看这个 AI 头像生成器！',
					url: window.location.href,
				}).catch(console.error);
			} else {
				navigator.clipboard.writeText(window.location.href).then(() => {
					alert('链接已复制到剪贴板！');
				});
			}
		});
	</script>
</body>
</html>
`;

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;

		if (path === '/') {
			return new Response(html, {
				headers: {
					'Content-Type': 'text/html',
				},
			});
		}

		if (path === '/api/generate') {
			const { prompt } = await request.json();

			const maxRequests = parseInt(env.MAX_REQUESTS_PER_DAY, 10);
			const key = `user:${request.headers.get('cf-connecting-ip')}`;
			const value = await env.RATE_LIMITER.get(key);

			if (value && parseInt(value, 10) >= maxRequests) {
				return new Response(
					JSON.stringify({
						error: '已超出使用次数限制，请明天再试。',
					}),
					{
						status: 429,
					}
				);
			}

			const newCount = value ? parseInt(value, 10) + 1 : 1;
			await env.RATE_LIMITER.put(key, newCount.toString(), {
				expirationTtl: 86400,
			});

			const inputs = {
				prompt: `你是一个专业的AI图像生成专家，专注于创建头像图片。请根据以下描述生成一张头像图片：${prompt}。要求：图片比例为1:1，格式为PNG，确保清晰度高，适合作为头像使用。`,
			};
			const response = await env.AI.generate(inputs);
			return new Response(response);
		}

		if (path === '/api/random-prompt') {
			const { style } = await request.json();

			const maxRequests = parseInt(env.MAX_RANDOM_DESC_PER_DAY, 10);
			const key = `user:${request.headers.get('cf-connecting-ip')}`;
			const value = await env.RANDOM_DESC_LIMITER.get(key);

			if (value && parseInt(value, 10) >= maxRequests) {
				return new Response(
					JSON.stringify({
						error: '已超出随机描述生成次数限制，请明天再试。',
					}),
					{
						status: 429,
					}
				);
			}

			const newCount = value ? parseInt(value, 10) + 1 : 1;
			await env.RANDOM_DESC_LIMITER.put(key, newCount.toString(), {
				expirationTtl: 86400,
			});

			const styleName = appConfig.styles.find(s => s.value === style)?.label;
			const messages = [
				{ 
					role: "system", 
					content: "你是一个专业的AI图像描述专家，擅长为头像生成创作精准、富有创意的描述。你的任务是为用户生成适合头像设计的中文描述，要求：1.使用中文描述；2.字数控制在30字以内；3.描述应包含角色特征、外观元素和风格要点。"
				},
				{
					role: "user",
					content: `请为"${styleName}"风格生成一个头像描述。要求：1.使用中文；2.字数不超过30个字；3.描述应包含角色特征、外观元素。例如："勇敢的骑士穿着闪亮的盔甲"、"大眼睛的可爱机器人"等。只返回描述内容，不要添加其他文字。`
				}
			];
			const response = await env.AI.run(
				'@cf/meta/llama-3.1-8b-instruct',
				{ messages }
			);
			let prompt = response || "一个神秘的角色";
			// Clean up the prompt - remove any quotes or extra formatting
			prompt = prompt.replace(/^["']|["']$/g, '').trim();
			// Ensure the prompt is in Chinese and within reasonable length
			if (prompt.length > 30) {
				prompt = prompt.substring(0, 30);
			}
			return new Response(JSON.stringify({ prompt }), {
				headers: { 'Content-Type': 'application/json' },
			});
		}

		return new Response('Not Found', {
			status: 404,
		});
	},
};
