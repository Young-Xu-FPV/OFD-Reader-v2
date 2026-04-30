#!/bin/bash

# OFD Reader 轻阅读器 - 一键构建部署脚本

set -e

echo "==========================================="
echo "  OFD Reader 轻阅读器 - 构建脚本"
echo "==========================================="
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js 18+"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到 npm"
    exit 1
fi

echo "✅ npm 版本: $(npm --version)"
echo ""

# 1. 安装依赖
echo "📦 步骤 1/4: 安装依赖..."
npm ci
echo "✅ 依赖安装完成"
echo ""

# 2. 构建项目
echo "🏗️  步骤 2/4: 构建项目..."
npm run build
echo "✅ 项目构建完成"
echo ""

# 3. 检查构建产物
if [ -d "dist" ]; then
    echo "✅ 构建产物目录: dist/"
    FILE_COUNT=$(find dist -type f | wc -l)
    echo "   文件数量: $FILE_COUNT"
    
    # 检查 index.html
    if [ -f "dist/index.html" ]; then
        echo "✅ 主文件: dist/index.html 存在"
    else
        echo "❌ 错误: dist/index.html 不存在"
        exit 1
    fi
else
    echo "❌ 错误: dist 目录不存在"
    exit 1
fi
echo ""

# 4. 创建部署包
echo "📦 步骤 4/4: 创建部署包..."
PACKAGE_NAME="ofd-reader-$(date +%Y%m%d-%H%M%S).zip"

# 打包
if command -v zip &> /dev/null; then
    cd dist
    zip -r "../$PACKAGE_NAME" .
    cd ..
    echo "✅ 部署包已创建: $PACKAGE_NAME"
else
    echo "⚠️  警告: 未找到 zip 命令，跳过打包"
fi
echo ""

# 输出完成信息
echo "==========================================="
echo "  🎉 构建完成！"
echo "==========================================="
echo ""
echo "部署方式:"
echo "  方式一: 将 dist 目录内容上传到 Web 服务器"
echo "  方式二: 使用 Docker 部署"
echo "  方式三: 使用部署包 $PACKAGE_NAME 部署"
echo ""
echo "详细说明请查看 DEPLOYMENT.md"
echo ""
