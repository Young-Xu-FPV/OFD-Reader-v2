# OFD Reader 轻阅读器 - 部署说明

## 项目简介

OFD Reader 是一款专为保险公司设计的 OFD 电子保单阅读器，支持桌面端和移动端两种视图，包含电子签章验证功能。

## 系统要求

- Node.js >= 18.0.0
- npm >= 9.0.0 或 yarn >= 1.22.0

## 部署步骤

### 方法一：使用构建后的静态文件部署（推荐）

#### 1. 构建项目

在项目根目录执行：

```bash
npm install
npm run build
```

构建完成后，会在 `dist` 目录生成静态文件。

#### 2. 部署到 Web 服务器

将 `dist` 目录下的所有文件部署到任意 Web 服务器（Nginx、Apache、Tomcat 等）。

##### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/your/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 配置 gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
```

##### Apache 配置示例

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /path/to/your/dist
    
    <Directory /path/to/your/dist>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        # SPA 路由支持
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

### 方法二：使用 Docker 部署

#### 1. 创建 Dockerfile（已提供）

项目已包含 Dockerfile，可以直接使用。

#### 2. 构建 Docker 镜像

```bash
docker build -t ofd-reader .
```

#### 3. 运行容器

```bash
docker run -d -p 80:80 --name ofd-reader ofd-reader
```

#### 4. 访问应用

在浏览器中访问 `http://your-server-ip`

### 方法三：使用 CI/CD 自动化部署

#### GitHub Actions 示例

在项目根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to server
        uses: easingthemes/ssh-deploy@v2
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          ARGS: "-rlgoDzvc --delete"
          SOURCE: "dist/"
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          TARGET: ${{ secrets.REMOTE_TARGET }}
```

## 项目配置说明

### Vite 配置

项目使用 Vite 作为构建工具，配置文件为 `vite.config.ts`。

### 环境变量

可以在项目根目录创建 `.env` 文件配置环境变量：

```env
VITE_APP_TITLE=OFD Reader 轻阅读器
VITE_APP_VERSION=1.0.0
```

## 维护说明

### 更新部署

1. 拉取最新代码
2. 重新构建：`npm run build`
3. 更新服务器上的静态文件
4. 重启 Web 服务器（如需要）

### 性能优化

- 开启 gzip 压缩
- 配置 CDN 加速
- 设置合理的缓存策略
- 图片资源使用 WebP 格式

### 安全建议

- 使用 HTTPS
- 配置 Content-Security-Policy
- 定期更新依赖包
- 限制文件上传大小（如需要）

## 常见问题

### Q: 构建失败怎么办？
A: 检查 Node.js 版本是否满足要求，清除 node_modules 重新安装依赖。

### Q: 页面刷新后 404？
A: 确保 Web 服务器配置了 SPA 路由支持（将所有路由指向 index.html）。

### Q: 如何修改端口？
A: 修改 Nginx/Apache 配置中的 listen 端口，或 Docker 命令中的端口映射。

### Q: 如何自定义域名？
A: 在 Web 服务器配置中修改 server_name，确保域名 DNS 已解析到服务器 IP。

## 技术支持

如有问题，请参考项目文档或联系技术支持。
