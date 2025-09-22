// 风格配置
export interface StyleConfig {
  value: string;
  label: string;
  description: string;
}

// 应用配置
export interface AppConfig {
  styles: StyleConfig[];
}

// 应用配置数据
export const appConfig: AppConfig = {
  styles: [
    {
      value: 'chibi',
      label: '二头身',
      description: '风格描述：以可爱的Q版角色为主，头部较大，身体比例短小，常用于表现萌系角色'
    },
    {
      value: 'pixel-art',
      label: '像素艺术',
      description: '风格描述：使用像素点组成图像，具有复古游戏的视觉效果'
    },
    {
      value: 'cyberpunk',
      label: '赛博朋克',
      description: '风格描述：未来科技感，霓虹灯光，常包含机械和电子元素'
    },
    {
      value: 'fantasy',
      label: '奇幻',
      description: '风格描述：包含魔法、龙、精灵等元素，营造出神秘的幻想世界'
    },
    {
      value: 'steampunk',
      label: '蒸汽朋克',
      description: '风格描述：以蒸汽动力为主题，结合维多利亚时代的设计元素'
    },
    {
      value: 'anime',
      label: '动漫',
      description: '风格描述：日本动漫特色画风，鲜明色彩和大眼睛角色特征'
    },
    {
      value: 'digital-art',
      label: '数字艺术',
      description: '风格描述：使用数字工具创作的艺术作品，色彩丰富，细节精致'
    },
    {
      value: 'comic-book',
      label: '漫画书',
      description: '风格描述：类似传统漫画书的视觉效果，鲜明的线条和色块'
    },
    {
      value: '3d-model',
      label: '3D模型',
      description: '风格描述：具有三维渲染效果，看起来像计算机生成的3D图像'
    },
    {
      value: 'photographic',
      label: '摄影',
      description: '风格描述：模拟真实摄影效果，注重光影和细节表现'
    }
  ]
};