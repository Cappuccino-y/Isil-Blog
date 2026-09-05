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

暗色模式开关、framer-motion 等新依赖、更换照片素材、服务端改动、localStorage key / JWT / 路由 / API 变化。老用户数据零影响。

## 6. 风险与回滚

| 风险 | 缓解 |
|---|---|
| 删除全局 h1/li 样式影响旧博客正文渲染 | 同步提供容器级样式替代；验收时逐篇目检既有博客（含《前端拾遗》） |
| 字体子集遗漏字符 | 仅 latin 子集用于拉丁标题；中文走系统栈；检查昆雅转写文本渲染 |
| 内联色替换引入回归 | 每页改完即时 Playwright 截图比对 + console 0 error |
| build 失败（CRA 严格模式） | 改完跑 `npm run build` 验证 |

回滚：单 commit 完成，出问题 revert 即可。

## 7. 验收清单

- [ ] 三页桌面 1600x900 + 移动 375x812 截图检查，console 0 error
- [ ] 登录 → 发博（含图片）→ 评论 → 登出 冒烟通过
- [ ] 旧博客（《前端拾遗》等）正文样式正常
- [ ] `npm run build` 通过
- [ ] favicon/浏览器标题栏显示新月徽记
- [ ] 重拍三图覆盖 `docs/screenshots/{home,login,blogs}.png`，README 增加「月光石设计语言」段落
- [ ] commit + push（SSH）
