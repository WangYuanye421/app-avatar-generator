// 风格配置
export interface StyleConfig {
  value: string;
  label: string;
  description: string;
  previewImage?: string;
}

// 应用配置
export interface AppConfig {
  styles: StyleConfig[];
}

// 应用配置数据
export const appConfig: AppConfig = {
  styles: [
    {
      value: 'none',
      label: '无风格，自由描述',
      description: '不使用特定艺术风格，完全根据描述生成图像',
      previewImage: 'http://t2mznic0t.hd-bkt.clouddn.com/avatar.wangyuanye.tech/style_none.png?e=1758614445&token=10TWVlDOhcLqvnc4_cJMvB984LjsE-8rjrENJgQd:_vq68pTTFFmuMbbhG3g5k36GXnY='
    },
    {
      value: 'chibi',
      label: '二头身',
      description: '风格描述：可爱的Q版角色，头部比例较大，身体短小，常用于表现萌系角色',
      previewImage: 'http://t2mznic0t.hd-bkt.clouddn.com/avatar.wangyuanye.tech/style_01.png?e=1758614424&token=10TWVlDOhcLqvnc4_cJMvB984LjsE-8rjrENJgQd:rgKsIa3kRIooid2ELE3Y4WsIfPo='
    },
    {
      value: 'pixel-art',
      label: '像素艺术',
      description: '风格描述：使用像素点组成图像，具有复古游戏的视觉效果',
      previewImage: ''
    },
    {
      value: 'cyberpunk',
      label: '赛博朋克',
      description: '风格描述：未来科技感，霓虹灯光，常包含机械和电子元素',
      previewImage: ''
    },
    {
      value: 'fantasy',
      label: '奇幻',
      description: '风格描述：魔法、巨龙、精灵等奇幻元素',
      previewImage: ''
    },
    {
      value: 'steampunk',
      label: '蒸汽朋克',
      description: '风格描述：维多利亚时代风格与蒸汽动力机械的结合',
      previewImage: ''
    },
    {
      value: 'anime',
      label: '动漫',
      description: '风格描述：日本动漫特色画风，鲜明色彩和大眼睛角色特征',
      previewImage: ''
    },
    {
      value: 'digital-art',
      label: '数字艺术',
      description: '风格描述：使用数字工具创作的艺术作品，色彩丰富，细节精致',
      previewImage: ''
    },
    {
      value: 'comic-book',
      label: '漫画书',
      description: '风格描述：类似传统漫画书的视觉效果，鲜明的线条和色块',
      previewImage: ''
    },
    {
      value: '3d-model',
      label: '3D模型',
      description: '风格描述：具有三维渲染效果，看起来像计算机生成的3D图像',
      previewImage: ''
    },
    {
      value: 'photographic',
      label: '摄影',
      description: '风格描述：模拟真实摄影效果，注重光影和细节表现',
      previewImage: ''
    }
  ]
};