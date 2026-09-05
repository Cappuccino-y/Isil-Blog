import {useContext, useState} from "react";
import LoginForm from "../components/LoginForm";
import Notification from "../components/Notification";
import {Grid, Typography, Box} from '@mui/material';
import MoodIcon from '@mui/icons-material/Mood';
import {FaFeatherAlt} from 'react-icons/fa';
import {AiFillHeart} from 'react-icons/ai';
import ExploreIcon from '@mui/icons-material/Explore';
import {FaPenFancy} from "react-icons/fa";
import {MdPublic} from "react-icons/md";
import ExampleContext from "../components/ExampleContext";


const LoginPage = ({handleLogin, message, setMessage}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const val = useContext(ExampleContext)


    return <Grid container className={"flexCenter animation-login"} style={{
        minHeight: '90vh', backgroundSize: "cover",
        backgroundPosition: "center", height: '100%'
    }}>
        <Box style={{minHeight: '9vh'}}>
            <Notification message={message}/>
        </Box>
        <Grid container spacing={0} style={{flexGrow: 0.2}}
        >
            <Grid item xs={12} md={7}>
                <Box sx={{my: 2, textAlign: 'center', paddingTop: '1vh'}}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{
                        color: '#000000',
                        fontFamily: 'Georgia, serif',
                        fontSize: '2.5em'
                    }}>
                        "Let your life lightly dance on the edges of Time like dew on the tip of a leaf." - Tagore
                    </Typography>
                    <FaFeatherAlt style={{fontSize: 100, color: '#F0FFF0', margin: 'auto', display: 'block'}}/>
                </Box>
            </Grid>
            <Grid item xs={12} md={5}>
                <Box sx={{my: 4, textAlign: 'center', marginLeft: '2vh'}}>
                    {/*<Typography variant="h4" component="h1" gutterBottom sx={{*/}
                    {/*    color: '#FF6347',*/}
                    {/*    fontFamily: 'Georgia, serif',*/}
                    {/*    fontSize: '1.5em'*/}
                    {/*}}>*/}
                    {/*    Welcome, Storyteller*/}
                    {/*</Typography>*/}
                    <LoginForm
                        handleLogin={handleLogin}
                        setMessage={setMessage}
                        username={username}
                        password={password}
                        setUsername={setUsername}
                        setPassword={setPassword}
                    />
                </Box>
            </Grid>
        </Grid>
    </Grid>


}

export default LoginPage