import {useState} from "react";
import LoginForm from "../components/LoginForm";
import Notification from "../components/Notification";
import {Box, Typography} from '@mui/material';
import {FaFeatherAlt} from 'react-icons/fa';

const MOON_FONT_BODY = "'EB Garamond','Noto Serif SC','Source Han Serif SC','STZhongsong','SimSun',serif";

/* 单轴居中构图：错误提示浮于顶部（不参与轴向布局），
   引言区（引言 + 中文小注 + 金线 + 金羽毛）与表单卡共用同一中轴，
   桌面端高度锁定 calc(100vh - 44px)，全部内容收进首屏 */
const LoginPage = ({handleLogin, message, setMessage}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    return <Box className="animation-login" sx={{
        position: 'relative',
        height: {md: 'calc(100vh - 108px)', xs: 'auto'},
        minHeight: {xs: '92vh', md: 0},
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: {md: 'center', xs: 'flex-start'},
        px: {xs: 2, sm: 3},
        py: {xs: 5, md: 0},
        pb: {md: '14vh'},
        textAlign: 'center',
    }}>
        <Box sx={{position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 3, px: 2}}>
            <Notification message={message}/>
        </Box>

        <Box className="moon-stagger-item" sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
            <Typography component="h1" sx={{
                color: '#1C2333',
                fontFamily: MOON_FONT_BODY,
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: {xs: '1.6rem', md: '2.2rem'},
                lineHeight: 1.45,
                letterSpacing: '0.02em',
                textShadow: '0 1px 18px rgba(244,246,250,.95), 0 1px 3px rgba(255,255,255,.8)',
                mb: {xs: 1.5, md: 2},
                maxWidth: 760,
            }}>
                {'"Elen síla lúmenn\' omentielvo."'}
            </Typography>
            <Typography sx={{
                color: '#4C5871',
                fontFamily: MOON_FONT_BODY,
                fontStyle: 'italic',
                fontSize: {xs: '1rem', md: '1.125rem'},
                letterSpacing: '0.12em',
                textShadow: '0 1px 12px rgba(244,246,250,.95)',
                mb: 0,
            }}>
                「群星闪耀于我们相逢之时」
            </Typography>
            <Box aria-hidden="true" sx={{
                width: 88, height: 2, margin: {md: '20px auto 18px', xs: '14px auto 10px'},
                borderRadius: '2px',
                background: 'linear-gradient(90deg, rgba(176,141,87,0), #B08D57, rgba(176,141,87,0))'
            }}/>
            <Box sx={{mb: {xs: 3, md: 4}}}>
                <Box sx={{
                    width: 76, height: 76, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(255,255,255,.5)',
                    border: '1px solid rgba(215,221,231,.9)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                    boxShadow: '0 6px 20px rgba(28,35,51,.10)',
                }}>
                    <FaFeatherAlt className="moon-float"
                                  style={{fontSize: 34, color: '#8C6D3F', display: 'block'}}/>
                </Box>
            </Box>
        </Box>

        <Box className="moon-stagger-item" sx={{width: '100%', animationDelay: '.12s'}}>
            <LoginForm
                handleLogin={handleLogin}
                setMessage={setMessage}
                username={username}
                password={password}
                setUsername={setUsername}
                setPassword={setPassword}
            />
        </Box>
    </Box>
}

export default LoginPage
