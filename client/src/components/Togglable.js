import {useState, forwardRef, useImperativeHandle} from 'react'
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import BlogForm from "./BlogForm";

const BRAND_FONT = "'Cinzel','Noto Serif SC','Source Han Serif SC','STZhongsong','SimSun',serif";

/* New Blog 弹窗：ref.toggleVisibility() 由外部按钮触发（接口与原 Togglable 一致） */
const Togglable = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false)

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    useImperativeHandle(ref, () => {
        return {
            toggleVisibility
        }
    })

    return (
        <Dialog
            open={visible}
            onClose={toggleVisibility}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '14px',
                    border: '1px solid #D7DDE7',
                    boxShadow: '0 18px 50px rgba(28,35,51,.18)',
                },
            }}
        >
            <Box sx={{
                px: {md: 4, xs: 2.5},
                py: 3.5,
                background: 'linear-gradient(180deg, rgba(244,246,250,.9), rgba(255,255,255,.96))',
            }}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1.25, mb: 2.5}}>
                    <Box component="img" src="/moonphases/2-moon-waxing-crescent-6.svg" alt=""
                         sx={{height: 24, width: 'auto', display: 'block'}}/>
                    <Typography sx={{
                        fontFamily: BRAND_FONT,
                        fontWeight: 600,
                        fontSize: '1.3rem',
                        color: '#1C2333',
                        letterSpacing: '.04em',
                    }}>
                        Compose a New Tale
                    </Typography>
                </Box>
                <BlogForm toggleVisibility={toggleVisibility}/>
            </Box>
        </Dialog>
    )
})

export default Togglable
