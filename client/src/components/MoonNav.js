import {useNavigate} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/Logout';

const NAV_FONT = "'EB Garamond','Noto Serif SC','Source Han Serif SC','STZhongsong','SimSun',serif";
const BRAND_FONT = "'Cinzel','Noto Serif SC','Source Han Serif SC','STZhongsong','SimSun',serif";

const NavLink = ({to, label, active, onClick}) => (
    <Button onClick={onClick} disableRipple sx={{
        position: 'relative',
        px: 1.5,
        minWidth: 0,
        color: active ? '#1C2333' : '#6E7B91',
        fontFamily: NAV_FONT,
        fontSize: '1.02rem',
        letterSpacing: '.05em',
        textTransform: 'none',
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 6,
            left: 14,
            right: 14,
            height: 2,
            borderRadius: '2px',
            background: 'linear-gradient(90deg, rgba(176,141,87,0), #B08D57, rgba(176,141,87,0))',
            opacity: active ? 1 : 0,
            transition: 'opacity .25s ease',
        },
        '&:hover': {backgroundColor: 'transparent', color: '#1C2333'},
    }}>
        {label}
    </Button>
);

/* 全局顶导航：月牙徽记 + ISIL 字标 + 导航 + 用户区，64px 磨砂玻璃条 */
const MoonNav = ({user, setUser, path}) => {
    const navigate = useNavigate();

    const signOut = () => {
        window.localStorage.removeItem('loggedBlogappUser')
        setUser(null)
        navigate('/home')
    };

    return (
        <AppBar position="fixed" elevation={0} sx={{
            height: 64,
            background: 'rgba(255,255,255,.72)',
            backdropFilter: 'blur(14px) saturate(130%)',
            WebkitBackdropFilter: 'blur(14px) saturate(130%)',
            borderBottom: '1px solid rgba(215,221,231,.9)',
            color: '#1C2333',
        }}>
            <Toolbar disableGutters sx={{
                height: 64,
                px: {xs: 2, md: 4},
                gap: 1,
                maxWidth: 1440,
                width: '100%',
                mx: 'auto',
            }}>
                <Box onClick={() => navigate('/home')} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    cursor: 'pointer',
                    mr: {md: 4},
                }}>
                    <Box component="img" src="/moonphases/2-moon-waxing-crescent-6.svg" alt=""
                         sx={{height: 26, width: 'auto', display: 'block'}}/>
                    <Typography sx={{
                        fontFamily: BRAND_FONT,
                        fontWeight: 600,
                        fontSize: '1.35rem',
                        letterSpacing: '.22em',
                        color: '#1C2333',
                        lineHeight: 1,
                    }}>
                        ISIL
                    </Typography>
                    <Typography sx={{
                        display: {xs: 'none', md: 'block'},
                        fontFamily: NAV_FONT,
                        fontStyle: 'italic',
                        fontSize: '.8rem',
                        color: '#6E7B91',
                        letterSpacing: '.08em',
                        borderLeft: '1px solid #D7DDE7',
                        pl: 1.5,
                        ml: .25,
                    }}>
                        Moonstone Journal
                    </Typography>
                </Box>

                <Box sx={{flex: 1, display: 'flex', alignItems: 'center', gap: .5}}>
                    <NavLink to="/home" label="Home" active={path === '/home'} onClick={() => navigate('/home')}/>
                    {user && <NavLink to="/blogs" label="Journal" active={path === '/blogs'}
                                      onClick={() => navigate('/blogs')}/>}
                </Box>

                {!user ? (
                    <Button onClick={() => navigate('/login')} variant="outlined" size="small" sx={{
                        color: '#4C5871',
                        borderColor: 'rgba(176,141,87,.55)',
                        borderRadius: '999px',
                        px: 2.5,
                        fontFamily: NAV_FONT,
                        letterSpacing: '.06em',
                        '&:hover': {
                            borderColor: '#B08D57',
                            background: 'rgba(176,141,87,.1)',
                        },
                    }}>
                        Sign in
                    </Button>
                ) : (
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5}}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 1,
                            py: .5,
                            borderRadius: '999px',
                            border: '1px solid #D7DDE7',
                            background: 'rgba(255,255,255,.6)',
                        }}>
                            <Box sx={{
                                width: 26, height: 26, borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: '#4C5871', color: '#fff',
                                fontFamily: BRAND_FONT, fontSize: 12,
                                boxShadow: '0 0 0 2px rgba(176,141,87,.35)',
                            }}>
                                {(user.name || '?').charAt(0).toUpperCase()}
                            </Box>
                            <Typography sx={{
                                fontFamily: NAV_FONT, fontSize: '.92rem', color: '#4C5871',
                                maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden',
                                textOverflow: 'ellipsis', display: {xs: 'none', sm: 'block'},
                            }}>
                                {user.name}
                            </Typography>
                        </Box>
                        <Button onClick={signOut} size="small" startIcon={<LogoutIcon sx={{fontSize: 17}}/>}
                                disableRipple sx={{
                            color: '#6E7B91',
                            fontFamily: NAV_FONT,
                            fontSize: '.9rem',
                            letterSpacing: '.05em',
                            textTransform: 'none',
                            minWidth: 0,
                            px: {xs: .5, sm: 1},
                            '& .MuiButton-startIcon': {mr: {xs: 0, sm: .5}},
                            '& .MuiButton-endIcon': {display: 'none'},
                            '&:hover': {color: '#B3564C', background: 'transparent'},
                        }}>
                            <Box component="span" sx={{display: {xs: 'none', sm: 'inline'}}}>
                                Sign out
                            </Box>
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default MoonNav;
