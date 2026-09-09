# Isil-Blog 本地一键启动（Windows / PowerShell）
# 用法: 在仓库根目录执行  .\scripts\dev.ps1
$ErrorActionPreference = 'Continue'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
Write-Host "== Isil-Blog 本地启动 ==" -ForegroundColor Cyan

# 1) 依赖检查与安装
foreach ($d in @('.', 'client', 'server')) {
    $dir = Join-Path $root $d
    if (-not (Test-Path (Join-Path $dir 'node_modules'))) {
        Write-Host "==> 安装依赖: $d" -ForegroundColor Yellow
        npm install --prefix $dir --no-audit --no-fund
        if ($LASTEXITCODE -ne 0) { Write-Host "[x] $d 依赖安装失败" -ForegroundColor Red; exit 1 }
    }
}

# 2) 环境文件检查
if (-not (Test-Path "$root\server\.env")) {
    Copy-Item "$root\server\.env.example" "$root\server\.env"
    Write-Host "[!] 已生成 server\.env —— 请填入 MONGODB_URI / SECRET 后重新运行" -ForegroundColor Yellow
    exit 1
}

# 3) 一键启动前后端（前端端口见 client\.env.development 的 PORT=3100）
npm run dev
