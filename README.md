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

## 本地启动

### 1. 安装依赖（首次）

```bash
cd D:\blog
npm install
npm run install:all
```

### 2. 配置数据库

```powershell
cp server/.env.example server/.env   # 填入你的 MongoDB 连接串和 JWT SECRET
```

- `MONGODB_URI`：MongoDB 连接串（Atlas 的 SRV 或标准串均可）
- `SECRET`：JWT 签名密钥
- 另需在 `client/public/token.txt` 放入 AI 客服用的 API Key（`api/gpt.js` 运行时读取，不入库）

### 3. 一键启动（推荐）

```bash
cd D:\blog
npm run dev
```

同时启动后端（http://localhost:3001）与前端（http://localhost:3100），浏览器访问 http://localhost:3100。

> 注：本机 3000 端口被 draw.io MCP 服务占用，故前端使用 3100（在 `client/.env.development` 的 `PORT=3100` 配置）。

### 4. 分开启动（可选）

```bash
# 终端 1：后端
npm run dev:server

# 终端 2：前端
npm run dev:client
```

## 生产构建

```bash
npm run build      # 产物在 client/build
```

## 与原项目的差异

- 前端 `services/` → `api/`，`formatDate`、`customImageCommand` 归入 `utils/`
- 后端改为 `config / db / models / controllers / middleware / utils` 分层
- Mongoose 连接从 model 文件中抽出，统一在 `db/connect.js`
- 图片上传 URL 由硬编码域名改为按请求动态生成（本地/线上均可用），并新增 `/images` 静态服务
- JWT SECRET、上传目录等统一走 `config`，删除了无用的 morgan/fs/os/path 伪依赖
- 环境变量按 CRA 约定拆分为 `.env.development` / `.env.production`
