import { appConfig } from './config';

interface Env {
	AI: Ai;
	APP_KV: KVNamespace;
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
			padding: 1rem;
			margin-bottom: 1rem;
			flex-shrink: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
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
			max-width: 480px; /* Max size for large screens */
			margin: 0 auto; /* Center the container */
			aspect-ratio: 1 / 1;
			border-radius: 1rem;
			overflow: hidden;
			box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
			border: 1px solid var(--border-color);
			background-color: var(--card-bg);
			align-items: center;
			justify-content: center;
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
		.style-preview-overlay {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
			display: flex;
			align-items: flex-end;
			justify-content: center;
			z-index: 10;
			color: white;
			font-size: 1.5rem;
			font-weight: bold;
			text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
			padding-bottom: 1rem;
			box-sizing: border-box;
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
			flex-shrink: 0;
			position: absolute;
			right: 1rem;
		}
		#share-app-btn:hover { 
			transform: scale(1.1);
			box-shadow: 0 8px 25px rgba(255, 0, 199, 0.5);
		}
		#share-app-btn svg {
			width: 32px;
			height: 32px;
		}
		.footer {
			text-align: center;
			padding: 1.5rem;
			color: var(--text-secondary);
			font-size: 0.9rem;
		}
		.custom-development {
			text-align: center;
			padding: 1rem;
			color: var(--text-secondary);
			font-size: 0.9rem;
		}
		.custom-development a {
			color: var(--primary-color);
			text-decoration: none;
			font-weight: 500;
			transition: color 0.2s ease;
		}
		.custom-development a:hover {
			color: var(--primary-dark);
			text-decoration: underline;
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
			<button id="share-app-btn" title="分享应用"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg></button>
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
					<textarea id="prompt" placeholder="例如：可爱的机器人、勇敢的骑士、神秘的法师..."></textarea>
				</div>
			</div>
			
			<section class="preview-section">
				<div class="image-container">
					<div class="image-wrapper">
						<div id="placeholder" class="placeholder-text">生成的头像将显示在这里</div>
						<div id="spinner" class="spinner hidden"></div>
						<div class="image-content hidden">
							<img id="image" src="" alt="生成的头像">
							<div id="style-preview-overlay" class="style-preview-overlay hidden">风格预览</div>
							<button id="download-btn" class="download-btn" title="下载图片"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></button>
						</div>
					</div>
				</div>
			</section>
			
			<div class="button-grid">
				<button id="generate-btn"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> 生成</button>
			</div>
		</section>
		<div class="custom-development">
			<a href="https://www.wangyuanye.tech" target="_blank" rel="noopener noreferrer">
				定制开发，了解更多
			</a>
		</div>
	<script>
		const spinner = document.getElementById('spinner');
		const imageWrapper = document.querySelector('.image-wrapper');
		const imageContent = document.querySelector('.image-content');
		const image = document.getElementById('image');
		const downloadBtn = document.getElementById('download-btn');
		const shareBtn = document.getElementById('share-app-btn');
		const placeholder = document.getElementById('placeholder');
		const stylePreviewOverlay = document.getElementById('style-preview-overlay');
		
		const styleSelect = document.getElementById('style');
		const promptInput = document.getElementById('prompt');
		const generateBtn = document.getElementById('generate-btn');
		const inlineRandomBtn = document.getElementById('inline-random-btn');
		const styleDescription = document.getElementById('style-description');

		// 检查关键元素是否存在
		if (!spinner || !imageWrapper || !imageContent || !image || !downloadBtn || 
			!shareBtn || !placeholder || !stylePreviewOverlay || !styleSelect || 
			!promptInput || !generateBtn || !inlineRandomBtn || !styleDescription) {
			console.error('页面初始化失败：一个或多个必需的DOM元素未找到');
			alert('应用加载失败，请刷新页面重试。');
			throw new Error('Missing required DOM elements');
		}

		let imageUrl = '';

		// 检查所有元素是否正确获取
		if (!inlineRandomBtn) {
			console.error('无法找到inlineRandomBtn元素');
		}
		
		if (!styleSelect) {
			console.error('无法找到styleSelect元素');
		}
		
		if (!promptInput) {
			console.error('无法找到promptInput元素');
		}
		
		// 风格描述映射
		const styleDescriptions = ${JSON.stringify(styleDescriptions)};
		const appConfig = ${JSON.stringify(appConfig)};

		// 更新风格描述
		function updateStyleDescription() {
			const selectedStyle = styleSelect.value;
			styleDescription.textContent = styleDescriptions[selectedStyle] || '';
			
			// 显示风格预览（如果已配置）
			const styleConfig = appConfig.styles.find(s => s.value === selectedStyle);
			if (styleConfig && styleConfig.previewImage) {
				// 如果有预览图URL，则显示预览图
				const previewImage = new Image();
				previewImage.onload = function() {
					image.src = this.src; // Use this.src which is the proxy URL
					imageContent.classList.remove('hidden');
					placeholder.classList.add('hidden');
					stylePreviewOverlay.classList.remove('hidden');
				};
				// 当图片加载失败时，直接隐藏预览
				previewImage.onerror = function() {
					console.error('预览图片加载失败:', styleConfig.previewImage);
					stylePreviewOverlay.classList.add('hidden');
				};
				// Use the proxy
				previewImage.src = '/api/image-proxy?url=' + encodeURIComponent(styleConfig.previewImage);
			} else {
				// 如果没有预览图，则隐藏预览遮罩
				stylePreviewOverlay.classList.add('hidden');
			}
		}

		// 初始化风格描述
		updateStyleDescription();

		// 风格选择变化时更新描述
		if (styleSelect) {
			styleSelect.addEventListener('change', updateStyleDescription);
		}

		if (generateBtn) {
			generateBtn.addEventListener('click', async () => {
				const style = styleSelect ? styleSelect.value : 'none';
				const prompt = (promptInput ? promptInput.value : '') || 'random character';
				let fullPrompt = '';
				
				// 如果选择了"无风格，自由描述"选项，则不添加风格后缀
				if (style === 'none') {
					fullPrompt = prompt;
				} else {
					fullPrompt = prompt + ', ' + style + ' style';
				}
				
				await generateImage(fullPrompt);
			});
		}

		// 新增的行内随机按钮事件
		if (inlineRandomBtn) {
			inlineRandomBtn.addEventListener('click', async (e) => {
				e.preventDefault();
				const style = styleSelect ? styleSelect.value : 'none';
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
						if (promptInput) {
							promptInput.value = prompt;
						}
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
		}

		async function generateImage(prompt) {
			placeholder.classList.add('hidden');
			spinner.classList.remove('hidden');
			imageContent.classList.add('hidden');
			stylePreviewOverlay.classList.add('hidden'); // 隐藏风格预览
			
			// 显示正在处理的提示
			placeholder.textContent = '正在处理提示词...';
			placeholder.classList.remove('hidden');

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
					placeholder.classList.add('hidden');
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

		if (downloadBtn) {
			downloadBtn.addEventListener('click', () => {
				const a = document.createElement('a');
				a.href = imageUrl;
				a.download = 'avatar.png';
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
			});
		}

		if (shareBtn) {
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
		}
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

		if (path.startsWith('/api/image-proxy')) {
			const imageUrl = url.searchParams.get('url');
			if (!imageUrl || !imageUrl.startsWith('http://')) {
				return new Response('Invalid image URL', { status: 400 });
			}

			try {
				const response = await fetch(imageUrl);
				if (!response.ok) {
					return new Response('Failed to fetch image', { status: response.status, statusText: response.statusText });
				}
				const imageResponse = new Response(response.body, {
					headers: {
						'Content-Type': response.headers.get('Content-Type') || 'image/png',
						'Cache-Control': 'public, max-age=86400', // Cache for 1 day
					},
				});
				return imageResponse;
			} catch (e) {
				return new Response('Error fetching image', { status: 500 });
			}
		}

		if (path === '/api/generate') {
			const requestData = await request.json() as { prompt: string };
			const { prompt: chinesePrompt } = requestData; // Rename for clarity

			const maxRequests = parseInt(env.MAX_REQUESTS_PER_DAY, 10);
			const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
			const userAgent = request.headers.get('User-Agent') || 'unknown';
			const key = `rate_limit:${ip}:${userAgent}`;

			const rateLimitData = await env.APP_KV.get(key, { type: 'json' });
			const { count = 0, timestamp = Date.now() } = (rateLimitData || {}) as { count: number; timestamp: number };

			const isNewDay = new Date().setHours(0, 0, 0, 0) > new Date(timestamp).setHours(0, 0, 0, 0);

			if (isNewDay) {
				await env.APP_KV.put(key, JSON.stringify({ count: 1, timestamp: Date.now() }), {
					expirationTtl: 86400,
				});
			} else if (count >= maxRequests) {
				return new Response(
					JSON.stringify({
						error: '已超出使用次数限制，请明天再试。',
					}),
					{
						status: 429,
						headers: { 'Content-Type': 'application/json' },
					}
				);
			} else {
				await env.APP_KV.put(key, JSON.stringify({ count: count + 1, timestamp }), {
					expirationTtl: 86400,
				});
			}

			// Step 1: Translate the Chinese prompt to English
			const translationMessages = [
				{ role: "system", content: "You are an expert translator for AI image generation. Translate the following Chinese text to a concise and descriptive English prompt. Output only the translated English text, without any extra explanations." },
				{ role: "user", content: chinesePrompt }
			];

			let englishPrompt = '';
			try {
				const translationResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', { messages: translationMessages });
				// Fallback to original prompt if translation fails or is empty
				let translatedText = translationResponse.response;
				if (translatedText) {
					// Clean up the translation response, removing potential quotes or extra text
					englishPrompt = translatedText.replace(/^["\'\s]+|[\"\'\s]+$/g, '').trim();
				} else {
					englishPrompt = chinesePrompt;
				}
			} catch (e) {
				console.error('Translation failed:', e);
				englishPrompt = chinesePrompt; // Fallback on error
			}

			// Step 2: Use the translated English prompt for image generation
			const inputs = {
				prompt: `${englishPrompt}, character portrait, standalone character, high quality, detailed face, best quality, masterpiece, sharp focus, 1:1 ratio`,
				negative_prompt: "interior design, room, furniture, architecture, building, indoor, home, office, nsfw, sketch, drawing, painting, low quality, blurry, deformed, ugly, messy, bad anatomy, bad hands, bad eyes, bad face, low resolution, extra limbs, bad proportions, duplicate, cropped, worst quality, multiple views, background, scenery, landscape, cityscape"
			};
			
			try {
				const response = await env.AI.run(
					'@cf/stabilityai/stable-diffusion-xl-base-1.0',
					inputs
				);
				return new Response(response, {
					headers: {
						'content-type': 'image/png',
					},
				});
			} catch (e) {
				return new Response(JSON.stringify({ error: '生成图片时发生错误' }), {
					status: 500,
					headers: { 'Content-Type': 'application/json' },
				});
			}
		}

		if (path === '/api/random-prompt') {
			const requestData = await request.json() as { style: string };
			const { style } = requestData;

			const maxRequests = parseInt(env.MAX_RANDOM_DESC_PER_DAY, 10);
			const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
			const userAgent = request.headers.get('User-Agent') || 'unknown';
			const key = `random_desc_limit:${ip}:${userAgent}`;

			const rateLimitData = await env.APP_KV.get(key, { type: 'json' });
			const { count = 0, timestamp = Date.now() } = (rateLimitData || {}) as { count: number; timestamp: number };

			const isNewDay = new Date().setHours(0, 0, 0, 0) > new Date(timestamp).setHours(0, 0, 0, 0);

			if (isNewDay) {
				await env.APP_KV.put(key, JSON.stringify({ count: 1, timestamp: Date.now() }), {
					expirationTtl: 86400,
				});
			} else if (count >= maxRequests) {
				return new Response(
					JSON.stringify({
						error: '已超出随机描述生成次数限制，请明天再试。',
					}),
					{
						status: 429,
						headers: { 'Content-Type': 'application/json' },
					}
				);
			} else {
				await env.APP_KV.put(key, JSON.stringify({ count: count + 1, timestamp }), {
					expirationTtl: 86400,
				});
			}

			let prompt;
			const styleConfig = appConfig.styles.find(s => s.value === style);
			const styleName = styleConfig?.label;
			const styleDescription = styleConfig?.description || '';

			// 根据是否选择"无风格"使用不同的提示策略
			const isNoneStyle = style === 'none';
			const systemPrompt = isNoneStyle 
				? "你是一位富有想象力的艺术家，擅长创造独特且引人注目的角色概念。请生成一个用于AI头像生成的简短中文描述。要求：1. 仅输出纯文本描述，不加任何解释或标点；2. 内容要新颖有趣，能激发AI的创造力；3. 严格控制在25个汉字以内；4. 适合作为单体角色头像；5. 避免'双头'、'多手'等会产生歧义的词汇。"
				: "你是一位资深的AI图像生成提示词工程师，专注于创作高质量的角色头像描述。请根据指定的艺术风格特点，生成符合以下要求的中文提示词：1. 仅输出纯文本描述内容，不要有任何额外说明或标点符号；2. 描述需体现角色核心特征与视觉元素；3. 严格控制在100个汉字以内；4. 确保描述适合头像构图（单体角色、正面/半身视角）；5. 避免产生歧义的表述如'双头'、'多手'等。";

			const userPrompt = isNoneStyle
				? "创造一个独特、有趣的角色头像描述，可以是任何你能想到的生物或人物，重点在于创意和视觉冲击力。例如：'星云环绕的精灵女王'、'机械心脏的蒸汽朋克侠客'。直接输出描述。"
				: `请基于"${styleName}"艺术风格（特点：${styleDescription}），创作一个角色头像的描述词。要求突出角色个性与视觉特征，适用于AI图像生成，输出简短有力的中文短语，长度不超过100字。示例：“银甲闪耀的勇猛武士”、“发光电路纹身的赛博少女”。只需返回描述本身。`;

			const messages = [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: userPrompt }
			];

			try {
				const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', { messages });
				prompt = response.response || (isNoneStyle ? "一个充满想象力的角色" : "一个神秘的角色");
			} catch (e) {
				console.error('LLM generation failed:', e);
				prompt = "一个独特的角色";
			}
			
			// 统一清理和处理生成的提示词
			prompt = prompt
				.replace(/^["\'\s]+|[\"\'\s]+$/g, '')
				.replace(/^(?:描述：|提示：|prompt：)/i, '')
				.trim();

			// 根据风格限制最大长度
			const maxLength = isNoneStyle ? 25 : 100;
			if (prompt.length > maxLength) {
				prompt = prompt.substring(0, maxLength);
			}

			// 过滤潜在问题词汇
			const blockedTerms = ['双头', '多手', '两个头', '三条手臂'];
			for (const term of blockedTerms) {
				if (prompt.includes(term)) {
					prompt = "一个独特的角色";
					break;
				}
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