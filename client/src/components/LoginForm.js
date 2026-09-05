import {useContext, useState} from 'react'
import {useNavigate} from "react-router-dom";
import {Button, Grid, TextField, Typography, Box} from '@mui/material';
import DialogReset from "./DialogReset";
import DialogSignUp from "./DialogSignUp";
import ExampleContext from "./ExampleContext";


const LoginForm = ({handleLogin, setMessage}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const val = useContext(ExampleContext)


    const userLogin = (event) => {
        event.preventDefault()
        handleLogin(username, password, navigate).then(() => {
            setUsername('')
            setPassword('')
        })
    }


    return <Box component="form" onSubmit={userLogin} sx={{width: '55%', mx: val.isMobile ? 'none' : 'auto'}}>
        <Grid container spacing={2} direction="column">
            <Grid item>
                <Typography variant="h4" align={val.isMobile ? 'center' : "left"}
                            sx={{fontFamily: '"Comic Sans MS", cursive, sans-serif', fontSize: '1.5em', color: '#333'}}>
                    Welcome, Storyteller!
                </Typography>
            </Grid>
            <Grid item>
                <TextField
                    fullWidth
                    sx={{backgroundColor: '#ffffff', borderRadius: '5px'}}
                    InputProps={{style: {fontSize: 20, fontFamily: 'Georgia, serif'}}}
                    label="Username"
                    value={username}
                    onChange={({target}) => setUsername(target.value)}
                />
            </Grid>
            <Grid item>
                <TextField
                    fullWidth
                    sx={{backgroundColor: '#ffffff', borderRadius: '5px'}}
                    InputProps={{style: {fontSize: 20, fontFamily: 'Georgia, serif'}}}
                    label="Password"
                    type='password'
                    value={password}
                    onChange={({target}) => setPassword(target.value)}
                />
            </Grid>
            <Grid item style={{display: 'flex', justifyContent: 'space-evenly'}}>
                <Button variant="contained" color="secondary" type="submit"
                        sx={{fontFamily: 'Georgia, serif', fontSize: '1.2em', marginRight: '8px'}}>
                    Login
                </Button>
                <DialogReset/>
                <DialogSignUp/>
            </Grid>
        </Grid>
    </Box>


}
export default LoginForm