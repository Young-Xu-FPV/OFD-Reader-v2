# OFD Reader 轻阅读器

一个基于 React + TypeScript + Vite 的轻量级 Web 端 OFD 文档阅读器，专为保险公司电子保单场景设计。

## 功能特性

- 📖 **文档阅读**: 支持 OFD 文档的完整阅读功能
- 📱 **响应式设计**: 适配桌面、平板和移动设备
- 🔍 **搜索高亮**: 支持全文搜索和关键字高亮
- 🔄 **页面导航**: 支持翻页、跳转、目录导航
- 🔍 **缩放旋转**: 支持文档缩放和旋转
- 🖨️ **打印下载**: 支持打印和下载文档
- 🎯 **重要条款标记**: 自动标记保单中的重要条款

## 技术栈

- React 18 + TypeScript
- Vite 6
- Tailwind CSS 3
- Lucide React Icons

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
src/
├── components/          # React 组件
│   ├── Reader.tsx       # 主阅读器组件
│   ├── DocumentViewer.tsx  # 文档显示组件
│   ├── Toolbar.tsx      # 工具栏组件
│   ├── NavigationBar.tsx   # 底部导航栏
│   └── Sidebar.tsx      # 侧边栏目录
├── hooks/               # 自定义 Hooks
├── types/               # TypeScript 类型定义
├── utils/               # 工具函数
│   └── ofdParser.ts     # OFD 文档解析器
├── App.tsx              # 应用入口组件
├── main.tsx             # 应用主入口
└── index.css            # 全局样式
```

## 使用说明

### 键盘快捷键

- `←` / `→`: 翻页
- `+` / `-`: 缩放
- `Esc`: 退出全屏

### 工具栏功能

1. **缩放控制**: 点击 + / - 按钮调整缩放比例
2. **旋转**: 点击旋转按钮旋转文档
3. **搜索**: 输入关键词进行全文搜索
4. **下载**: 下载当前文档
5. **打印**: 打印文档
6. **全屏**: 进入/退出全屏模式

### 侧边栏

- **文档信息**: 显示文档标题、作者等元数据
- **章节目录**: 点击跳转到对应章节
- **重要条款**: 快速定位重要条款位置

## License

MIT
