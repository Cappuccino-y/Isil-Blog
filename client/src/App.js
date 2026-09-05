import {useState, useRef, useEffect} from 'react'
import React, {Suspense, lazy} from 'react';
import blogService from './api/blogs'
import loginService from './api/login'
import userService from './api/users'
import FooterLink from "./components/FootLink";
import {useMediaQuery, useTheme} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import {ThemeProvider} from "@mui/material";
import {
    BrowserRouter as Router,
    Routes, Route, Navigate, useLocation
} from "react-router-dom"
import ExampleContext, {ExampleProvider} from "./components/ExampleContext";
import SnackBlogbar from "./components/SnackBlogbar";
import CustomerServiceChat from "./components/CustomerServiceChat";
import MoonNav from "./components/MoonNav";

const HomePage = lazy(() => import('./pages/HomePage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))

/* Router 内感知当前路径的导航 */
const Nav = ({user, setUser}) => {
    const {pathname} = useLocation();
    return <MoonNav user={user} setUser={setUser} path={pathname}/>;
};


const HomePageBg = ({user}) => {
    useEffect(() => {
        document.body.style = `background: #F4F6FA;`;
        return () => {
            document.body.style = '';
        };
    }, []);

    return (
        <HomePage user={user}/>
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
            setMessage('注册成功，请登录')
            setSnackbarOpen(true)
            return
        } catch (error) {
            setMessage('用户名或昵称已被注册，密码至少 3 位')
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
            setMessage('用户名或密码错误')
            setSnackbarOpen(true)
            return
        }
        try {
            window.localStorage.removeItem('loggedBlogappUser')
            await userService.update(userInfo.username, userInfo.newPassword)
            setMessage('修改成功')
            setSnackbarOpen(true)
        } catch (exception) {
            setMessage('修改失败')
            setSnackbarOpen(true)
        }
    }

    const handleLogin = async (username, password, navigate) => {
        try {
            const user = await loginService.login({
                username, password,
            })
            setSnackOpen(true)
            setSnackMessage('登录成功 · 明月迎你归')
            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(user)
            )
            blogService.setToken(user.token)
            setUser(user)
            setTimeout(() => {
                navigate('/blogs')
            }, 1000)
        } catch (exception) {
            notice('用户名或密码错误', 'error')
        }
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <Box component="main" sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                minHeight: 0,
                width: '100%',
                pt: '64px',
            }}>
                <ExampleProvider val={{handleReset, handleSignUp, isMobile}}>
                    <Router>
                        <Nav user={user} setUser={setUser}/>
                        <Suspense fallback={
                            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh'}}>
                                <CircularProgress color='inherit' size={70}/>
                            </Box>
                        }>
                            <Routes>
                                <Route path="" element={<Navigate to={'/home'}/>}/>
                                <Route path="/home" element={<HomePageBg user={user}/>}/>
                                <Route path="/login" element={<LoginPageBg handleLogin={handleLogin} message={message}
                                                                           setMessage={setMessage}/>}/>
                                <Route path="/blogs"
                                       element={<BlogPageBg user={user} message={message} setUser={setUser}
                                                            users={users}
                                                            blogFormRef={blogFormRef} notice={notice}/>}/>
                            </Routes>
                        </Suspense>
                    </Router>
                </ExampleProvider>
            </Box>
            <FooterLink/>
            <SnackBlogbar open={snackOpen} setOpen={setSnackOpen} message={snackMessage}/>
            {user && <CustomerServiceChat/>}
        </Box>
    )
}

export default App
