import { createTheme } from '@mui/material/styles'

// 月光石（Isil Moonstone）设计规范 §3
// 色板 70/20/10：雾白底 + 墨黛/银灰文字 + 黛青主色 + 香槟金点睛(≤10%)
export const moonColors = {
  mist: '#F4F6FA',      // 雾白页面底色
  paper: '#FFFFFF',     // 卡片/面板
  divider: '#D7DDE7',   // 描边/分隔线
  ink: '#1C2333',       // 墨黛：顶栏/标题/正文
  indigo: '#4C5871',    // 黛青：主按钮/强调
  silver: '#6E7B91',    // 银灰：次要文字
  champagne: '#B08D57', // 香槟金：hover/图标/金线
  error: '#B3564C',     // 柔化红
}

// 字体栈 §3.2：标题 Cinzel + 中文衬线；正文/引言 EB Garamond + 中文衬线；
// UI 控件 Roboto；代码 Roboto Mono。中文一律系统衬线栈，不下载 webfont。
export const moonFontHeading =
  "'Cinzel','Noto Serif SC','Source Han Serif SC','STZhongsong','SimSun',serif"
export const moonFontBody =
  "'EB Garamond','Noto Serif SC','Source Han Serif SC','STZhongsong','SimSun',serif"
export const moonFontUI = "'Roboto','Helvetica','Arial',sans-serif"
export const moonFontCode =
  "'Roboto Mono','SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace"

// 形状/阴影/动效 §3.3
export const moonShadow = '0 8px 30px rgba(28, 35, 51, .08)'
export const moonHalo = '0 0 0 3px rgba(176, 141, 87, .25)'

const chineseSerif =
  "'Noto Serif SC','Source Han Serif SC','STZhongsong','SimSun',serif"

const headingVariant = {
  fontFamily: `Cinzel, ${chineseSerif}`,
  color: moonColors.ink,
  fontWeight: 600,
}

const bodyVariant = {
  fontFamily: `EB Garamond, ${chineseSerif}`,
  color: moonColors.ink,
}

const moonTheme = createTheme({
  palette: {
    background: { default: moonColors.mist, paper: moonColors.paper },
    divider: moonColors.divider,
    primary: { main: moonColors.indigo, dark: moonColors.ink },
    secondary: { main: moonColors.champagne },
    error: { main: moonColors.error },
    text: { primary: moonColors.ink, secondary: moonColors.silver },
  },
  typography: {
    fontFamily: moonFontUI,
    h1: headingVariant,
    h2: headingVariant,
    h3: headingVariant,
    h4: headingVariant,
    h5: headingVariant,
    h6: headingVariant,
    subtitle1: bodyVariant,
    subtitle2: bodyVariant,
    body1: bodyVariant,
    body2: bodyVariant,
    button: { fontFamily: moonFontUI },
  },
  shape: { borderRadius: 10 },
  shadows: [
    'none',
    ...Array(24).fill(moonShadow),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&:hover': { boxShadow: moonHalo },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
  },
})

export default moonTheme
