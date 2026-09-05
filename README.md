# Blog — React + Express + MongoDB

重构自 `D:\WebStormProject` 的博客项目（原 `FinalProject/bloglist-frontend` + `part4`），改为前后端分离的 monorepo 结构。

## 目录结构

```
blog/
├── client/                     # 前端 (React 18 + CRA + MUI + Redux)
│   ├── public/                 # 静态资源（背景图、favicon、token.txt）
│   ├── src/
│   │   ├── api/                # 接口层（axios 封装：blogs/users/login/images/gpt）
│   │   ├── components/         # 通用组件（Blog、Comment、LoginForm、Dialog…）
│   │   ├── pages/              # 页面（HomePage / LoginPage / BlogPage）
│   │   ├── utils/              # 工具（formatDate、customImageCommand）
│   │   ├── App.js              # 路由与全局状态
│   │   └── index.js
│   ├── .env.development        # 开发环境 API 地址（localhost:3001）
│   └── .env.production         # 生产环境 API 地址（mistysakura.top）
├── server/                     # 后端 (Node + Express + Mongoose)
│   ├── src/
│   │   ├── config/             # 环境变量集中读取
│   │   ├── db/                 # MongoDB 连接
│   │   ├── models/             # Mongoose 模型（blog、user）
│   │   ├── controllers/        # 路由控制器（blogs/users/login/images）
│   │   ├── middleware/         # JWT、日志、错误处理中间件
│   │   ├── utils/              # logger
│   │   ├── app.js              # Express 应用与路由挂载
│   │   └── index.js            # 入口（HTTP listen）
│   └── .env                    # 数据库连接、端口、JWT SECRET
└── package.json                # 根：一键安装/一键启动
```

## 本地启动（一键）

```powershell
cd D:\blog
.\scripts\dev.ps1        # 自动装依赖、检查 .env，然后同时拉起前后端
```

或手动：

```powershell
npm install
npm run install:all
npm run dev              # 后端 :3001 + 前端 :3100
```

浏览器访问 http://localhost:3100（本机 3000 被占用，前端端口在 `client/.env.development` 配置）。

### 环境文件说明

| 文件 | 用途 | 是否入库 |
|---|---|---|
| `server/.env` | 数据库连接串、JWT SECRET、图片目录 | ❌ 本地自行创建（参考 `.env.example`） |
| `client/public/token.txt` | AI 客服 API Key（`api/gpt.js` 运行时读取） | ❌ |
| `client/.env.development` | 开发 API 地址 + 端口 | ✅ |
| `client/.env.production` | 生产 API 地址（构建兜底，deploy 脚本会按域名覆盖） | ✅ |

## 部署到服务器（nginx + HTTPS）

服务器上执行（以 Ubuntu + nginx 为例），全程非交互、可重复执行：

```bash
git clone git@github.com:Cappuccino-y/Isil-Blog.git && cd Isil-Blog/deploy
cp deploy.conf.example deploy.conf    # 按需修改域名/路径/端口
sudo bash deploy.sh
```

脚本自动完成：

1. 安装依赖（root / client / server）
2. 构建前端（按 `deploy.conf` 的域名注入 API 地址）
3. 同步静态资源到 `WEB_ROOT`、准备图片目录
4. 生成/校对 `server/.env`（含 `UPLOAD_DIR` 对齐图片目录）
5. 启动后端（pm2 守护，自动安装；或 nohup 模式）
6. 由 `nginx.conf.template` 生成配置并 `nginx -t` 校验（失败自动保留原配置）
7. 重载 nginx

**nginx 配置要点**（对比旧版的改进）：

- 80 端口 301 强制跳转 HTTPS（旧版无跳转）
- SPA `try_files` 兜底在两个端口都生效（旧版 80 缺失，刷新非首页会 404）
- 仅 TLSv1.2/1.3 + 现代 cipher 套件（旧版含已弃用的 TLSv1/1.1）
- `/images/` alias 与后端 `UPLOAD_DIR` 对齐，旧图片链接 `/images/<用户名>/...` 不受影响
- `/api/` 反代补了 `X-Forwarded-Proto`（后端可正确生成 https 图片 URL）
- gzip 压缩文本资源

证书文件（`$DOMAIN.pem/.key`）需提前放到 `deploy.conf` 指定的路径（默认 `/etc/nginx/ssl/`）；每次改动配置只需重跑 `deploy.sh`，nginx 修改前会自动备份为 `nginx.conf.bak.*`。

## 与原项目的差异

- 前端 `services/` → `api/`，`formatDate`、`customImageCommand` 归入 `utils/`
- 后端改为 `config / db / models / controllers / middleware / utils` 分层
- Mongoose 连接从 model 文件中抽出，统一在 `db/connect.js`
- 图片上传 URL 由硬编码域名改为按请求动态生成（本地/线上均可用），并新增 `/images` 静态服务
- JWT SECRET、上传目录等统一走 `config`，删除了无用的 morgan/fs/os/path 伪依赖
- 环境变量按 CRA 约定拆分为 `.env.development` / `.env.production`
