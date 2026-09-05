import {useState, useRef, useEffect} from 'react'
import React, {Suspense, lazy} from 'react';
import blogService from './api/blogs'
import loginService from './api/login'
import userService from './api/users'
import FooterLink from "./components/FootLink";
import {Container, useMediaQuery, useTheme} from '@mui/material'
import {createTheme} from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import {ThemeProvider} from "@mui/material";
import {
    BrowserRouter as Router,
    Routes, Route, Link, Navigate, useNavigate
} from "react-router-dom"
import ExampleContext, {ExampleProvider} from "./components/ExampleContext";
import SnackBlogbar from "./components/SnackBlogbar";
import CustomerServiceChat from "./components/CustomerServiceChat";

const HomePage = lazy(() => import('./pages/HomePage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))


const HomePageBg = () => {
    useEffect(() => {
        document.body.style = `background: url(bg1.jpg) no-repeat center center fixed; -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover; background-size: cover;`;
        return () => {
            document.body.style = '';
        };
    }, []);

    return (
        <HomePage/>
    );
}

const LoginPageBg = ({setMessage, message, handleLogin}) => {
    useEffect(() => {
        document.body.style = `background: url(bg2.jpg) no-repeat center center fixed; -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover; background-size: cover;`;
        return () => {
            document.body.style = '';
        };
    }, []);

    return (
        <LoginPage handleLogin={handleLogin}
                   message={message} setMessage={setMessage}/>
    );
}

const BlogPageBg = ({user, message, setUser, blogFormRef, notice, users}) => {
    useEffect(() => {
        document.body.style = `background: url(bg3.jpg) left center; -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover; background-size: cover;`;
        return () => {
            document.body.style = '';
        };
    }, []);

    return (
        <BlogPage user={user} message={message} setUser={setUser} users={users}
                  blogFormRef={blogFormRef} notice={notice}/>
    );
}
const App = () => {
    const [user, setUser] = useState(null)
    const [users, setUsers] = useState([])
    const [message, setMessage] = useState({content: '', sign: ''})
    const [snackMessage, setSnackMessage] = useState('')
    const [snackOpen, setSnackOpen] = useState(false)
    const blogFormRef = useRef()
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await userService.getAll()
                setUsers(res)
            } catch (error) {
                console.log(error)
            }
        }
        fetchUsers()
    }, [])

    const notice = (content, sign) => {
        setMessage(
            {content: content, sign: sign}
        )
        setTimeout(() => {
            setMessage({content: '', sign: ''})
        }, 3000)
    }
    const handleSignUp = async (userInfo, setSnackbarOpen, setMessage) => {
        try {
            const user = await userService.create({
                username: userInfo.username, password: userInfo.password, name: userInfo.name
            })
            setMessage('Create success, please log in')
            setSnackbarOpen(true)
            return
        } catch (error) {
            setMessage('Username or name registered and at least 3 words for password')
            setSnackbarOpen(true)
            return
        }
    }

    const handleReset = async (userInfo, setSnackbarOpen, setMessage) => {
        try {
            await loginService.login({
                username: userInfo.username, password: userInfo.oldPassword
            })
        } catch (error) {
            setMessage('Wrong username or password')
            setSnackbarOpen(true)
            return
        }
        try {
            window.localStorage.removeItem('loggedBlogappUser')
            await userService.update(userInfo.username, userInfo.newPassword)
            setMessage('Change successful')
            setSnackbarOpen(true)
        } catch (exception) {
            setMessage('Change failed')
            setSnackbarOpen(true)
        }
    }

    const handleLogin = async (username, password, navigate) => {
        try {
            const user = await loginService.login({
                username, password,
            })
            setSnackOpen(true)
            setSnackMessage('Login successful')
            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(user)
            )
            blogService.setToken(user.token)
            setUser(user)
            setTimeout(() => {
                navigate('/blogs')
            }, 1000)
        } catch (exception) {
            notice('Wrong username or password', 'error')
        }
    }

    return (
        <div>
            <Container>
                <ExampleProvider val={{handleReset, handleSignUp, isMobile}}>
                    <Router>
                        <Suspense fallback={
                            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh'}}>
                                <CircularProgress color='inherit' size={70}/>
                            </Box>
                        }>
                            <Routes>
                                <Route path="" element={<Navigate to={'/home'}/>}/>
                                <Route path="/home" element={<HomePageBg/>}/>
                                <Route path="/login" element={<LoginPageBg handleLogin={handleLogin} message={message}
                                                                           setMessage={setMessage}/>}/>
                                <Route path="/blogs"
                                       element={<BlogPageBg user={user} message={message} setUser={setUser}
                                                            users={users}
                                                            blogFormRef={blogFormRef} notice={notice}/>}/>
                            </Routes>
                        </Suspense>
                    </Router>
                    <FooterLink/>
                    <SnackBlogbar open={snackOpen} setOpen={setSnackOpen} message={snackMessage}/>
                </ExampleProvider>
            </Container>
            {user && <CustomerServiceChat/>}
        </div>
    )
}

export default App
