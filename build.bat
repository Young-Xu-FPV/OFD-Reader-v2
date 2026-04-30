@echo off
REM OFD Reader 轻阅读器 - Windows 构建脚本

echo ===========================================
echo   OFD Reader 轻阅读器 - 构建脚本
echo ===========================================
echo.

REM 检查 Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 Node.js，请先安装 Node.js 18+
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do echo ✅ Node.js 版本: %%i

REM 检查 npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 npm
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do echo ✅ npm 版本: %%i
echo.

REM 1. 安装依赖
echo 📦 步骤 1/4: 安装依赖...
call npm ci
if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败
    exit /b 1
)
echo ✅ 依赖安装完成
echo.

REM 2. 构建项目
echo 🏗️ 步骤 2/4: 构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ 项目构建失败
    exit /b 1
)
echo ✅ 项目构建完成
echo.

REM 3. 检查构建产物
if not exist "dist" (
    echo ❌ 错误: dist 目录不存在
    exit /b 1
)

echo ✅ 构建产物目录: dist/
if exist "dist\index.html" (
    echo ✅ 主文件: dist\index.html 存在
) else (
    echo ❌ 错误: dist\index.html 不存在
    exit /b 1
)
echo.

REM 输出完成信息
echo ===========================================
echo   🎉 构建完成！
echo ===========================================
echo.
echo 部署方式:
echo   方式一: 将 dist 目录内容上传到 Web 服务器
echo   方式二: 使用 Docker 部署
echo.
echo 详细说明请查看 DEPLOYMENT.md
echo.
pause
