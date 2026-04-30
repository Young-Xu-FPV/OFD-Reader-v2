# OFD Reader 部署检查清单

## 📦 部署文件说明

### 需要的文件（完整项目）
- [ ] `package.json` - 项目配置文件
- [ ] `package-lock.json` - 依赖锁定文件
- [ ] `tsconfig.json` - TypeScript 配置
- [ ] `vite.config.ts` - Vite 配置
- [ ] `tailwind.config.js` - Tailwind CSS 配置
- [ ] `postcss.config.js` - PostCSS 配置
- [ ] `src/` - 源代码目录
- [ ] `index.html` - 入口 HTML
- [ ] `build.sh` - Linux/Mac 构建脚本（可选）
- [ ] `build.bat` - Windows 构建脚本（可选）

### Docker 部署文件
- [ ] `Dockerfile` - Docker 镜像配置
- [ ] `docker-compose.yml` - Docker Compose 配置
- [ ] `nginx.conf` - Nginx 配置
- [ ] `.dockerignore` - Docker 忽略文件

### 部署说明文档
- [ ] `DEPLOYMENT.md` - 详细部署说明
- [ ] `DEPLOY_CHECKLIST.md` - 本检查清单

## 🚀 快速开始

### 方式一：最简单（推荐）
1. 在新机器上安装 Node.js 18+
2. 复制整个项目目录
3. 运行构建脚本：
   - Linux/Mac: `./build.sh`
   - Windows: `build.bat`
4. 将生成的 `dist` 目录内容上传到 Web 服务器

### 方式二：使用 Docker
1. 复制项目文件到新机器
2. 运行 `docker-compose up -d`
3. 访问 http://localhost:80

### 方式三：只使用构建产物
如果你已经有构建好的 `dist` 目录：
1. 只需要复制 `dist` 目录内容
2. 部署到任意 Web 服务器
3. 配置服务器支持 SPA 路由（详见 DEPLOYMENT.md）

## 📋 部署前检查

- [ ] 目标机器是否已安装 Node.js 18+？
- [ ] 是否有 npm 或 yarn？
- [ ] Web 服务器是否已准备好？（Nginx/Apache/Tomcat 等）
- [ ] 如需 HTTPS，是否已准备好证书？
- [ ] 是否需要配置域名？

## ✅ 部署后验证

- [ ] 访问网站是否正常？
- [ ] 桌面端视图是否正常？
- [ ] 移动端视图是否正常？
- [ ] 切换视图功能是否正常？
- [ ] 页面刷新后是否 404？
- [ ] 图片资源是否正常加载？

## 📞 需要帮助？

参考 `DEPLOYMENT.md` 获取详细说明
