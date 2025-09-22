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
      description: '风格描述：可爱的Q版角色，头部比例较大，身体短小，常用于表现萌系角色'
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
      description: '风格描述：魔法、巨龙、精灵等奇幻元素'
    },
    {
      value: 'steampunk',
      label: '蒸汽朋克',
      description: '风格描述：维多利亚时代风格与蒸汽动力机械的结合'
    }
  ]
};