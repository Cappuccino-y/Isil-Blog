# Isil 月光石主题设计文档

日期：2026-09-05 · 项目：Isil-Blog（D:\blog） · 分支：main

## 1. 背景与目标

Isil-Blog 的 "Isil" 是昆雅语的"月亮"（直译"银辉 the Sheen"），首页欢迎语即《魔戒》书信名句"愿诸神护佑你通往西方之地的旅途"。当前前端视觉是早期叠加的结果：无 ThemeProvider、53 处内联硬编码色、Pacifico / Comic Sans MS / Georgia 字体混用、`index.css` 存在全局元素选择器污染（`h1{color:green;font-style:italic}`、`li{color:grey;font-size:12px}`）。

目标：以"月光石"为设计语言做一次全面视觉统一 + 文案托尔金化，不改动任何业务逻辑与服务端代码。

## 2. 已确认决策

| 决策项 | 结论 |
|---|---|
| 视觉方向 | A·月光石（浅色月光系 + 香槟金点睛 + 衬线标题），与现有粉色系照片素材兼容 |
| 改造范围 | B·全套：MUI 主题 + 背景层 + 文案 + favicon + CSS 动效 + README 重拍同步 |
| 站名 | 「LYYのspace」保留，仅辅助文案托尔金化，昆雅语点缀保留 |
| 实现方式 | MUI `createTheme` 集中主题（新 `client/src/theme/theme.js` + ThemeProvider），弃 CSS 变量覆盖与换库方案 |
| AI 助手（v2 增补） | 更名 Tilion·驾月者；API 由前端裸调 chatanywhere → 服务端代理调 MiniMax-M3；能力边界 **B·只读+全文工具**（目录注入 + get_blog function calling，均过可见性过滤），不做写/删操作 |

## 3. 设计规范

### 3.1 色板（70/20/10）

| Token | 值 | 用途 |
|---|---|---|
| `palette.background.default` | `#F4F6FA` | 页面底色（雾白，约 70%） |
| `palette.background.paper` | `#FFFFFF` | 卡片/面板 |
| `palette.divider` | `#D7DDE7` | 描边/分隔线 |
| `palette.primary.main` | `#4C5871` | 主按钮/强调（黛青） |
| `palette.primary.dark` | `#1C2333` | 顶栏/标题（墨黛） |
| `palette.text.primary` | `#1C2333` | 正文标题 |
| `palette.text.secondary` | `#6E7B91` | 次要文字 |
| `palette.secondary.main` | `#B08D57` | 香槟金点睛（hover/图标/金线，≤10%） |
| `palette.error.main` | `#B3564C` | 错误提示（柔化红） |

### 3.2 字体

- 自托管 latin 子集 woff2（`client/public/fonts/`，`font-display: swap`）：
  - **Cinzel** 600（标题拉丁）
  - **EB Garamond** 400 / 400 italic / 600（正文与引言拉丁）
- 中文一律系统衬线栈，不下载 webfont：`'Noto Serif SC','Source Han Serif SC','STZhongsong','SimSun',serif`
- 组合：标题 `Cinzel, <中文衬线栈>`；正文/引言 `EB Garamond, <中文衬线栈>`；UI 控件保持 Roboto；代码保持 Roboto Mono
- 删除 `index.html` 中 Google Fonts 外链（Roboto/Pacifico/Monoton）；代码中全部 Comic Sans MS 移除

### 3.3 形状 / 阴影 / 动效

- `borderRadius`：10（卡片 12）
- 柔影：`0 8px 30px rgba(28,35,51,.08)`
- 纯 CSS 动效（不引新依赖）：按钮 hover 月晕（`box-shadow: 0 0 0 3px rgba(176,141,87,.25)`）、卡片 hover 上浮 4px + 金环描边、首页三段 staggered 入场（delay 0/.1/.2s）、loading 圆点红→银灰；现有 listTransition/item/fade 动画保留

## 4. 逐页改造清单

### 4.1 Home（`pages/HomePage.js`）

- 布局与素材（0.jpg 左栏 + 1~4.jpg 图片墙）不变
- 昆雅语主标题：Pacifico `#008080` → EB Garamond Italic 600 `#1C2333`
- 副题：Comic Sans → EB Garamond Italic `#6E7B91`
- `Enter` 按钮 → 「**启程 · Enter**」：透明底 + 香槟金描边，hover 填充黛青 + 月晕
- 标题与按钮之间加**八相月行** SVG 装饰（新月→满月，黛青，宽约 200px）
- 图片墙 Paper：加 1px `#D7DDE7` 描边 + 柔影
- 背景色 `#f4f6f8` → token 引用

### 4.2 Login（`pages/LoginPage.js` + `components/LoginForm.js`）

- bg2.jpg 保留
- 引言：Tagore → **"Elen síla lúmenn' omentielvo."**（群星闪耀于我们相逢之时）+ 中文小注；字体 EB Garamond Italic `#1C2333`
- 羽毛图标 `#F0FFF0` → 香槟金 `#B08D57`
- 表单卡（`.loginform` 青绿渐变）→ 月石玻璃卡：`rgba(255,255,255,.92)` + `backdrop-blur(12px)` + 顶部 1px 金色发丝线 + 圆角 12
- 输入框/按钮字体 Georgia → 主题 token；`borderRadius` 5→10

### 4.3 Blogs（`pages/BlogPage.js` + `components/Blog.js`、`BlogShow.js`）

- bg3.jpg 保留；页头标题 Pacifico `#191970` → Cinzel+衬线 `#1C2333`；副题 Comic Sans → 银灰
- 新建博客切换按钮 `grey/#00a7d0` → 黛青/香槟金
- 博客卡：`backgroundColor:'transparent'` → 白卡 + 柔影 + hover 上浮金环
- 标题字体 Comic Sans / Arial / Roboto Mono 散点 → 主题 token（代码块保留 Roboto Mono）
- `components/BlogShow.js`：`#f50057`/`#aa0039` 按钮 → 黛青主按钮 + 金色 hover；`#f6f6f6` 面板 → `#F4F6FA`
- `components/DialogSignUp.js`：`#191970`/`#000080` → 黛青/墨黛；`components/DialogReset.js` Georgia → token
- AI 客服（`components/CustomerServiceChat.js`）：用户气泡 `#fff2e6`→暖金雾 `#FFF6E8`、AI 气泡 `#e6f7ff`→雾白 `#EAF0F6`、发送按钮 `#007BFF`→黛青、占位字体 `"Your Font Name"` 删除

### 4.4 全局

- `index.js`：包 `<ThemeProvider theme={moonTheme}>` + `<CssBaseline/>`
- `index.css` 清理：删全局 `h1{color:green...}`、`li{color:grey...}`（博客正文样式改为容器级作用域：在现有 `.modifytext` 容器类上扩展或新增等价类——标题 Cinzel/衬线墨黛、列表银灰 15px，不再用元素全局选择器）；`.person` 红→黛青加粗；`.dot` 红→银灰；`.loginform` 换玻璃卡；动画保留；**自定义光标保留不动**
- `components/FootLink.js`：ICP 链接 `#133`→`#6E7B91`、hover `#007bff`→`#B08D57`；上方加一行小字 "A journey beneath Isil, the Sheen."（银灰 12px）
- 通知文案中文化：`Login successful`→「登录成功 · 明月迎你归」、`Create success, please log in`→「注册成功，请登录」、错误提示同步中文化（App.js 内 notice/handle 消息）

### 4.5 index.html 与 favicon

- `<title>LYYのspace` 保留；`lang`→`zh-CN`；`description`→「LYYのspace — 愿诸神护佑你通往西土的旅途（Isil 月光主题博客）」；`theme-color` `#000000`→`#F4F6FA`
- 新 **新月徽记** favicon（黛青圆底 + 香槟金月牙 + 一粒星）：SVG 源文件入 `client/public/`；`<link rel="icon">` 用 SVG（现代浏览器）+ 32px PNG 兜底 + 180px apple-touch PNG；32px ICO 由 node 脚本（如 `png-to-ico`）生成替换 `seven.ico` 引用，生成失败则以 PNG 兜底链接代替
- `manifest.json` 主题色同步

## 5. 明确不做（YAGNI）

暗色模式开关、framer-motion 等新依赖、更换照片素材、localStorage key / JWT / 路由变化、存量 API 行为变化——老用户数据零影响。Tilion 的服务端代理为纯新增接口（/api/ai/chat），不触碰现有 blogs/users/login/images 接口；AI 不做写/删操作。

## 6. 风险与回滚

| 风险 | 缓解 |
|---|---|
| 删除全局 h1/li 样式影响旧博客正文渲染 | 同步提供容器级样式替代；验收时逐篇目检既有博客（含《前端拾遗》） |
| 字体子集遗漏字符 | 仅 latin 子集用于拉丁标题；中文走系统栈；检查昆雅转写文本渲染 |
| 内联色替换引入回归 | 每页改完即时 Playwright 截图比对 + console 0 error |
| build 失败（CRA 严格模式） | 改完跑 `npm run build` 验证 |
| opencode 里的 key 为 coding-plan 订阅 key，不可用于按量付费端点 | 实施时先发 1 条冒烟请求验证；不可用则回报用户换 key |
| M3 推理模型非流式响应偏慢 | thinking: disabled + 4096 上限；Tilion 面板保留 loading 圆点；流式输出留 Roadmap |

回滚：单 commit 完成，出问题 revert 即可。

## 7. Tilion AI 助手（v2 增补）

### 7.1 背景问题

现有实现（`client/src/api/gpt.js`）：前端运行时 `fetch('token.txt')` 取 key，`dangerouslyAllowBrowser: true` 直调 chatanywhere，模型 gpt-3.5-turbo——**key 对任何访客可见**；系统提示词仅有 KaTeX 约定；欢迎语 typo「基于 GFT-4」。

### 7.2 架构（服务端代理）

```
浏览器 Tilion 面板 → POST /api/ai/chat（JWT）→ server/src/controllers/ai.js
  1. tokenChecker 校验 + 内存限流（每用户 20 条/5 分钟 → 429；单条消息 ≤4000 字符）
  2. 取该用户可见博客目录（标题 + 摘要 ≤120 字 + id，按 blog.visible.includes(user.name) 过滤）注入 system prompt
  3. 注册只读工具 get_blog(id)：返回该用户可见博客全文
  4. 调 MiniMax（原生 fetch，零新依赖）：
     - POST ${MINIMAX_API_BASE:-https://api.minimaxi.com/v1}/chat/completions
     - Bearer ${MINIMAX_API_KEY}；model ${MINIMAX_MODEL:-MiniMax-M3}
     - thinking: {type:'disabled'}（客服快答）；max_completion_tokens: 4096
  5. 工具循环最多 2 轮 → 返回 { reply }
  6. 历史截断：仅保留最近 12 条消息
```

- 路由挂载于 `server/src/app.js`；`server/.env` 增 `MINIMAX_API_KEY` / `MINIMAX_MODEL` / `MINIMAX_API_BASE`（海外账号备选 `https://api.minimax.io/v1`）；`.env.example` 同步
- key 从本机 opencode 配置由脚本提取写入 `server/.env`（不打印、不入库）；写入后发 1 条冒烟请求验证 key 类型（coding-plan 订阅 key 若不可用于按量端点则回报用户）

### 7.3 前端

- `client/src/api/gpt.js` 重写为 axios `POST /api/ai/chat`（带用户 JWT）；`client/package.json` 移除 `openai` 依赖；删除 `client/public/token.txt`
- `CustomerServiceChat.js` 重构：
  - 浮动按钮：黛青胶囊 + 金色月牙图标 + 「Tilion」（替换蓝色 Chat 按钮）
  - 面板：白 92% 玻璃卡 + 金色发丝顶线；标题栏「Tilion · 驾月者」
  - 气泡：用户 `#FFF6E8` 暖金雾 / Tilion `#EAF0F6` 雾白；角色名 `#6E7B91`
  - 欢迎语：「Tilion 已就绪——可以问我任何事，或让我为你找一篇博客。」；placeholder「问 Tilion 吧…」；发送按钮黛青
  - 保留 MDEditor.Markdown + Code 组件的 KaTeX 渲染链路；系统级 KaTeX 格式约定移到服务端 system prompt
- 主题配色细则同 §4.3

### 7.4 安全

- 密钥只存在于服务端 `.env`；前端产物 grep 无密钥字符串
- 无任何写路径：`get_blog` 只读 + 可见性过滤；不做写/删（Roadmap 项）

## 8. 验收清单

- [ ] 三页桌面 1600x900 + 移动 375x812 截图检查，console 0 error
- [ ] 登录 → 发博（含图片）→ 评论 → 登出 冒烟通过
- [ ] 旧博客（《前端拾遗》等）正文样式正常
- [ ] `npm run build` 通过
- [ ] favicon/浏览器标题栏显示新月徽记
- [ ] Tilion：key 冒烟请求成功；未登录调 /api/ai/chat → 401；限流触发 → 429
- [ ] Tilion：能推荐真实博客并引用标题；get_blog 工具可被调用且只返回该用户可见博客
- [ ] Tilion：前端 dist 中 grep 无 API key 字符串
- [ ] 重拍三图覆盖 `docs/screenshots/{home,login,blogs}.png`，README 增加「月光石设计语言」段落与 Tilion 说明、环境表更新（去 token.txt，增 MINIMAX_*）
- [ ] commit + push（SSH）
