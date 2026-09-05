import {useNavigate} from "react-router-dom";
import {Button, Container, Typography, Grid, Box, Paper} from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import EmojiNatureIcon from '@mui/icons-material/EmojiNature';
import {useContext} from "react";
import ExampleContext from "../components/ExampleContext";

const HomePage = () => {
    const navigate = useNavigate()
    const val = useContext(ExampleContext)
    const switchPage = () => {
        navigate('/login')
    }
    return <div className='animation-home'>
        <Grid container style={{height: val.isMobile ? '90vh' : "92vh", background: "#f4f6f8"}}>
            <Grid item xs={12} md={6} style={{
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundImage: `url(0.jpg)`
            }}>
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                    padding={2}
                >
                    <Typography variant="h3" align="center" gutterBottom
                                sx={{color: '#008080', fontFamily: 'Pacifico', fontSize: '2.5em'}}>
                        Nai tiruvantel ar varyuvantel i Valar tielyanna nu vilya.
                    </Typography>
                    <Typography variant="h6" align="center" color="textSecondary"
                                fontFamily='"Comic Sans MS", cursive, sans-serif'>
                        Valin na omentiemme. Anar caluva tielyanna.
                    </Typography>
                    <Button
                        variant="contained"
                        style={{backgroundColor: '#6495ED', color: '#ffffff'}}
                        onClick={switchPage}
                        endIcon={<LoginIcon/>}
                        sx={{marginTop: 2}}
                        size='large'
                    >
                        Enter
                    </Button>
                </Box>
            </Grid>
            <Grid item xs={12} md={6}>
                <Grid container direction="row" justifyContent="space-between"
                      style={{height: '100%', paddingLeft: '6px'}}>
                    <Grid item style={{width: '49.7%', paddingRight: '0%'}}>
                        <Paper
                            sx={{
                                width: "100%",
                                height: "60%",
                                overflow: "hidden",
                                marginBottom: "0%",
                            }}
                        >
                            <Box
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundImage: `url(1.jpg)`
                                }}
                            />
                        </Paper>
                        <Paper
                            sx={{
                                width: "100%",
                                height: "40%",
                                overflow: "hidden",
                            }}
                        >
                            <Box
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundImage: `url(2.jpg)`
                                }}
                            />
                        </Paper>
                    </Grid>
                    <Grid item style={{width: '49.7%', paddingLeft: '0%'}}>
                        <Paper
                            sx={{
                                width: "100%",
                                height: "40%",
                                overflow: "hidden",
                                marginBottom: "0%",
                            }}
                        >
                            <Box
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundImage: `url(3.jpg)`
                                }}
                            />
                        </Paper>
                        <Paper
                            sx={{
                                width: "100%",
                                height: "60%",
                                overflow: "hidden",
                            }}
                        >
                            <Box
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundImage: `url(4.jpg)`
                                }}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </div>

}

export default HomePage