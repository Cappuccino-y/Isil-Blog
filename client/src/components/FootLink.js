import Box from '@mui/material/Box';

const DOT_SX = {color: '#B08D57', px: '2px', userSelect: 'none', flexShrink: 0};

/* 细腰页脚：高度锁定 36px 条身 + 8px 底距 = 44px（桌面端），
   宽度跟随外层 Container 内容宽，引言行与备案链接合并为一行 */
const FooterLink = () => {
    return (
        <Box component="footer" sx={{
            flexShrink: 0,
            mt: 'auto',
            px: {xs: 1, md: 0},
            pb: 1,
        }}>
            <Box sx={{
                minHeight: 36,
                height: {md: 36, xs: 'auto'},
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: {xs: 'wrap', md: 'nowrap'},
                rowGap: '2px',
                columnGap: '8px',
                px: {xs: 1.5, md: 2},
                py: {xs: '6px', md: 0},
                mx: 'auto',
                maxWidth: 1180,
                borderRadius: '10px',
                border: '1px solid #D7DDE7',
                background: 'rgba(255,255,255,.66)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                color: '#6E7B91',
                fontSize: '12.5px',
                letterSpacing: '.02em',
                fontFamily: "'EB Garamond','Noto Serif SC','Source Han Serif SC','STZhongsong','SimSun',serif",
            }}>
                <span>A journey beneath Isil, the Sheen.</span>
                <Box component="span" sx={DOT_SX}>·</Box>
                <a className="moon-foot-link" href="https://beian.miit.gov.cn/" target="_blank"
                   rel="noreferrer">浙ICP备2023009285号</a>
                <Box component="span" sx={DOT_SX}>·</Box>
                <a className="moon-foot-link"
                   href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010602013040"
                   target="_blank" rel="noreferrer">浙公网安备 33010602013040号</a>
            </Box>
        </Box>
    )
}

export default FooterLink
