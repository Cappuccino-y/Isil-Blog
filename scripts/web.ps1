# Isil-Blog web（Next.js 15 全栈）启动脚本（Windows / PowerShell）
# 用法: 在仓库根目录执行
#   .\scripts\web.ps1           # 开发模式 (next dev)
#   .\scripts\web.ps1 deploy    # 生产模式 (构建 + next start)
param(
    [ValidateSet('dev', 'deploy')]
    [string]$Mode = 'dev'
)
$ErrorActionPreference = 'Continue'
$root = Split-Path -Parent $PSScriptRoot
$web = Join-Path $root 'web'
Set-Location $root
Write-Host "== Isil-Blog web ($Mode) ==" -ForegroundColor Cyan

# 1) 依赖检查与安装（已装则跳过）
if (-not (Test-Path (Join-Path $web 'node_modules'))) {
    Write-Host "==> 安装依赖: web" -ForegroundColor Yellow
    npm install --prefix $web --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) { Write-Host "[x] web 依赖安装失败" -ForegroundColor Red; exit 1 }
}

# 2) 环境文件检查（缺省时自动从旧 server\.env 迁移所需变量）
if (-not (Test-Path (Join-Path $web '.env.local'))) {
    $src = Join-Path $root 'server\.env'
    $vars = 'MONGODB_URI', 'MINIMAX_API_KEY', 'MINIMAX_MODEL', 'MINIMAX_API_BASE', 'SECRET'
    if (Test-Path $src) {
        $lines = Get-Content $src | Where-Object { $n = ($_ -split '=', 2)[0]; $vars -contains $n -and $_ -notmatch '^\s*#' -and $_.Trim() -ne '' }
        Set-Content -Path (Join-Path $web '.env.local') -Value $lines -Encoding utf8
        Write-Host "==> 已从 server\.env 迁移 $($lines.Count) 个变量到 web\.env.local" -ForegroundColor Green
    } else {
        Write-Host "[!] 缺少 web\.env.local —— 请填入 MONGODB_URI / SECRET（可选 MINIMAX_*）后重新运行" -ForegroundColor Yellow
        exit 1
    }
}

Set-Location $web

if ($Mode -eq 'deploy') {
    # 3) 生产构建 + 启动
    Write-Host "==> 构建 (next build --turbopack)" -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) { Write-Host "[x] 构建失败" -ForegroundColor Red; exit 1 }
    Write-Host "==> 启动 http://localhost:3000" -ForegroundColor Cyan
    npx next start -p 3000
} else {
    # 3) 开发启动（端口 3000 被占用则改 3001）
    $port = 3000
    if (Test-NetConnection -ComputerName localhost -Port $port -InformationLevel Quiet -WarningAction SilentlyContinue) {
        $port = 3001
        Write-Host "[!] 端口 3000 被占用，改用 $port" -ForegroundColor Yellow
    }
    Write-Host "==> 启动 http://localhost:$port" -ForegroundColor Cyan
    npx next dev --turbopack -p $port
}
