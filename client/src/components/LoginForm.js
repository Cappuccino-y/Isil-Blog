import {useState} from 'react'
import {useNavigate} from "react-router-dom";
import {Button, TextField, Typography, Box} from '@mui/material';
import DialogReset from "./DialogReset";
import DialogSignUp from "./DialogSignUp";

const uiFont = "'Roboto', 'Helvetica', 'Arial', sans-serif";
const titleFont = "'Cinzel', 'Noto Serif SC', 'Source Han Serif SC', 'STZhongsong', 'SimSun', serif";

/* 皮肤统一由 index.css 的 .moon-glass 提供（rgba 白 + blur + 描边 + 柔影 + 金发丝线） */
const glassCardSx = {
    width: '100%',
    maxWidth: 440,
    mx: 'auto',
    p: {xs: 3, sm: 4},
    position: 'relative',
    overflow: 'hidden',
};

const fieldSx = {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    mb: 2,
};

const LoginForm = ({handleLogin, setMessage}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const userLogin = (event) => {
        event.preventDefault()
        handleLogin(username, password, navigate).then(() => {
            setUsername('')
            setPassword('')
        })
    }

    return <Box className="moon-glass" sx={glassCardSx}>
        <Box component="form" onSubmit={userLogin}
             sx={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Box component="img" src="/moonphases/2-moon-waxing-crescent-6.svg" alt=""
                 className="moon-float-soft"
                 sx={{height: 30, width: 'auto', display: 'block', mb: 1}}/>
            <Typography variant="h4" align="center"
                        sx={{fontFamily: titleFont, fontWeight: 600, fontSize: '1.5em', color: '#1C2333',
                             letterSpacing: '0.03em', lineHeight: 1.35}}>
                Welcome, Storyteller!
            </Typography>
            <Box component="span" aria-hidden="true" sx={{
                width: 72, height: 2, borderRadius: '2px', my: 1.25,
                background: 'linear-gradient(90deg, rgba(176,141,87,0), #B08D57, rgba(176,141,87,0))'
            }}/>
            <Typography variant="body2" align="center"
                        sx={{color: '#6E7B91', fontFamily: uiFont, letterSpacing: '0.06em', mb: 2.5}}>
                Sign in to keep writing beneath the moonlight
            </Typography>
            <TextField
                fullWidth
                sx={fieldSx}
                InputProps={{style: {fontSize: 20, fontFamily: uiFont}}}
                label="Username"
                value={username}
                onChange={({target}) => setUsername(target.value)}
            />
            <TextField
                fullWidth
                sx={{...fieldSx, mb: 1}}
                InputProps={{style: {fontSize: 20, fontFamily: uiFont}}}
                label="Password"
                type='password'
                value={password}
                onChange={({target}) => setPassword(target.value)}
            />
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1.5, mt: 1.5, flexWrap: 'wrap'}}>
                <Button variant="contained" color="secondary" type="submit"
                        sx={{fontFamily: uiFont, fontSize: '1.2em',
                             px: 3, letterSpacing: '0.04em',
                             transition: 'background-color .3s ease, box-shadow .3s ease, transform .3s ease',
                             '&:hover': {transform: 'translateY(-2px)'}}}>
                    Login
                </Button>
                <DialogReset/>
                <DialogSignUp/>
            </Box>
        </Box>
    </Box>


}
export default LoginForm
