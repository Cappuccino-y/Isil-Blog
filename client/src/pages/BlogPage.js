import {useEffect, useState} from "react";
import Togglable from "../components/Togglable";
import BlogForm from "../components/BlogForm";
import BlogShow from "../components/BlogShow";
import BlogDetail from "../components/BlogDetail";
import Notification from "../components/Notification";
import {useNavigate} from "react-router-dom";
import {Grid, Typography, Button, Box, IconButton} from '@mui/material';
import {Select, MenuItem, TextField} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SortIcon from '@mui/icons-material/Sort';
import blogService from "../api/blogs";
import imageService from '../api/images';
import DialogForBlog from "../components/DialogForBlog";
import {ExampleProvider} from "../components/ExampleContext";
import SnackBlogbar from "../components/SnackBlogbar";

const MOON_FONT = "'Cinzel','Noto Serif SC','Source Han Serif SC','STZhongsong','SimSun',serif";
const BODY_FONT = "'EB Garamond','Noto Serif SC','Source Han Serif SC','STZhongsong','SimSun',serif";
const UI_FONT = "'Roboto','Helvetica','Arial',sans-serif";

const BlogPage = ({user, message, blogFormRef, setUser, notice, users}) => {

    const [blogs, setBlogs] = useState([])
    const [isPrivate, setisPrivate] = useState(false)
    const [buttonColor, setButtonColor] = useState('grey')
    const [searchOption, setSearchOption] = useState('title');
    const [searchText, setSearchText] = useState('');
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [openbar, setOpenbar] = useState(false)
    const [caution, setCaution] = useState('')
    const [openExpire, setOpenExpire] = useState(false);
    const [blogId, setBlogId] = useState('')

    const navigate = useNavigate()

    const sortedByLikes = () => {
        setButtonColor(buttonColor === 'grey' ? '#00a7d0' : 'grey');
    }
    const blogsShow = blogs.filter(blog => blog[searchOption].toLowerCase().includes(searchText.toLowerCase()))
    const addBlog = (blogObject) => {
        blogFormRef.current.toggleVisibility()
        const newValue = blogObject
        blogService.create(newValue).then(response => {
            setBlogs([response, ...blogs])
            setCaution('Blog add success')
            setOpenbar(true)
        }).catch(error => {
            notice(`Blog add failed`, 'error')
            console.log(error)
        })
    }

    const updateBlog = async (blog) => {
        try {
            const updatedBlog = await blogService.update(blog.id, blog)
            setBlogs(blogs.map(b => b.id !== updatedBlog.id ? b : updatedBlog))
        } catch (error) {
            notice('Update failed', 'error')
        }
    }
    const deleteItem = (id) => {
        const delItem = async () => {
            try {
                await blogService.del(id)
                setBlogs(blogs.filter(blog => blog.id !== id))
                setCaution('Delete Success')
                setOpenbar(true)
            } catch (error) {
                notice('Delete failed', 'error')
            }
        }
        delItem()
    }

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            blogService.setToken(user.token)
            imageService.setToken(user.token)
            setUser(user)
        }
    }, [])

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await blogService.getAll()
                setBlogs(res.reverse())
            } catch {
                if (user) {
                    setOpenExpire(true)
                }
            }
        }
        fetchBlogs()
        setIsLoadingUser(false)
    }, [user])


    if (isLoadingUser) {
        return <div>Loading...</div>;
    }

    /* 工作台：64px 导航 + 44px 页脚，桌面首屏 calc(100vh - 108px) 无滚动 */
    const blog = blogs.find(b => b.id === blogId)
    return <ExampleProvider
        val={{blogs, setBlogs, setOpenExpire, blogId, setBlogId, updateBlog, user, blog, addBlog, users}}>
        <Grid container className={'animation-blog'} columnSpacing={2} sx={{
            width: '100%',
            maxWidth: 1440,
            mx: 'auto',
            px: {xs: 0, md: 2},
            height: {md: 'calc(100vh - 108px)', xs: 'auto'},
            minHeight: {xs: '92vh', md: 0},
        }}>
            {/* 左：期刊列表 */}
            <Grid item md={5} xs={12} sx={{minHeight: 0, height: {md: '100%'}}}>
                <Box className="moon-glass" sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    p: 2,
                    width: '100%',
                    height: {md: '100%', xs: 'auto'},
                }}>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0}}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1.25}}>
                            <Box component="img" src="/moonphases/2-moon-waxing-crescent-6.svg" alt=""
                                 className="moon-breathe"
                                 sx={{height: 22, width: 'auto', display: 'block'}}/>
                            <Typography sx={{
                                fontFamily: MOON_FONT,
                                fontWeight: 600,
                                fontSize: '1.25rem',
                                color: '#1C2333',
                                letterSpacing: '.05em',
                            }}>
                                Journal
                            </Typography>
                            <Typography sx={{
                                display: {xs: 'none', md: 'block'},
                                fontFamily: UI_FONT, fontSize: '11px',
                                letterSpacing: '.2em', textTransform: 'uppercase',
                                color: '#6E7B91',
                            }}>
                                {blogsShow.length} tales
                            </Typography>
                        </Box>
                        <Button variant="contained" startIcon={<PostAddIcon/>} size="small"
                                onClick={() => blogFormRef.current.toggleVisibility()}
                                sx={{
                                    backgroundColor: '#4C5871',
                                    color: '#F4F6FA',
                                    borderRadius: '999px',
                                    px: 2,
                                    letterSpacing: '.04em',
                                    fontFamily: UI_FONT,
                                    '&:hover': {backgroundColor: '#B08D57', transform: 'translateY(-1px)'},
                                }}>
                            New Blog
                        </Button>
                    </Box>
                    <Togglable buttonLabel='new blog' ref={blogFormRef} blog={blog} updateBlog={updateBlog}
                               user={user} blogs={blogs}>
                        <BlogForm createBlog={addBlog}/>
                    </Togglable>

                    {/* 工具行 */}
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mt: 1.5, flexShrink: 0}}>
                        <Button variant="outlined" size="small" onClick={() => setisPrivate(false)}
                                sx={{color: '#1C2333', px: 1.5, minWidth: 0, fontSize: '12.5px',
                                     borderColor: !isPrivate ? '#B08D57' : '#D7DDE7',
                                     background: !isPrivate ? 'rgba(176,141,87,.12)' : 'transparent',
                                     boxShadow: !isPrivate ? '0 0 0 2px rgba(176,141,87,.15)' : 'none'}}>
                            Public
                        </Button>
                        <Button variant="outlined" size="small" onClick={() => setisPrivate(true)}
                                sx={{color: '#1C2333', px: 1.5, minWidth: 0, fontSize: '12.5px',
                                     borderColor: isPrivate ? '#B08D57' : '#D7DDE7',
                                     background: isPrivate ? 'rgba(176,141,87,.12)' : 'transparent',
                                     boxShadow: isPrivate ? '0 0 0 2px rgba(176,141,87,.15)' : 'none'}}>
                            Private
                        </Button>
                        <IconButton size="small" onClick={sortedByLikes}
                                    sx={{
                                        color: buttonColor === 'grey' ? '#6E7B91' : '#B08D57',
                                        border: '1px solid',
                                        borderColor: buttonColor === 'grey' ? '#D7DDE7' : 'rgba(176,141,87,.55)',
                                        background: buttonColor === 'grey' ? 'transparent' : 'rgba(176,141,87,.12)',
                                        '&:hover': {background: 'rgba(76,88,113,.08)'},
                                    }}>
                            <SortIcon sx={{fontSize: 17}}/>
                        </IconButton>
                        <Select
                            value={searchOption}
                            onChange={event => {
                                setSearchOption(event.target.value)
                            }}
                            size='small'
                            sx={{
                                width: 92,
                                fontSize: '12.5px',
                                fontFamily: UI_FONT,
                                '& .MuiOutlinedInput-notchedOutline': {borderColor: '#D7DDE7'},
                            }}
                        >
                            <MenuItem value={'title'}>Title</MenuItem>
                            <MenuItem value={'content'}>Content</MenuItem>
                            <MenuItem value={'tag'}>Tag</MenuItem>
                        </Select>
                        <TextField
                            variant="outlined"
                            size='small'
                            placeholder="Search…"
                            onChange={event => {
                                setSearchText(event.target.value)
                            }}
                            sx={{
                                flex: 1, minWidth: 0,
                                '& .MuiOutlinedInput-root': {
                                    fontSize: '12.5px',
                                    backgroundColor: 'rgba(255,255,255,.85)',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {borderColor: '#D7DDE7'},
                            }}
                            InputProps={{
                                endAdornment: (
                                    <SearchIcon sx={{fontSize: 16, color: '#6E7B91'}}/>
                                ),
                            }}
                        />
                    </Box>
                    <Notification message={message}/>

                    {/* 列表 + 分页 */}
                    <Box sx={{mt: 1, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column'}}>
                        <BlogShow isPrivate={isPrivate} buttonColor={buttonColor} stateListen={blogs}
                                  deleteItem={deleteItem} blogs={blogsShow} updateBlog={updateBlog} user={user}
                        />
                    </Box>
                </Box>
            </Grid>

            {/* 右：阅读面板 */}
            <Grid item md={7} xs={12} sx={{minHeight: 0, height: {md: '100%'}, display: 'flex', flexDirection: 'column'}}>
                {blog ?
                    <BlogDetail blog={blog} deleteItem={deleteItem} isPrivate={isPrivate}
                                updateBlog={updateBlog} user={user}/>
                    :
                    <Box className="moon-glass" sx={{
                        width: '100%',
                        height: {md: '100%', xs: 320},
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1.75,
                    }}>
                        <Box component="img" src="/moonphases/2-moon-waxing-crescent-6.svg" alt=""
                             className="moon-float-soft"
                             sx={{height: 44, width: 'auto', display: 'block', opacity: .92}}/>
                        <Typography sx={{
                            fontFamily: MOON_FONT,
                            fontWeight: 600,
                            fontSize: '1.15rem',
                            color: '#1C2333',
                            letterSpacing: '.08em',
                        }}>
                            Select a tale to unveil
                        </Typography>
                        <Typography sx={{
                            fontFamily: BODY_FONT, fontStyle: 'italic',
                            fontSize: '.92rem', color: '#4C5871', opacity: .85,
                        }}>
                            「从左侧翻开一篇故事，月光将在此铺开」
                        </Typography>
                    </Box>
                }
                <DialogForBlog open={openExpire} setOpen={setOpenExpire}
                               handleEvents={
                                   () => {
                                       navigate("/login")
                                       setUser(null)
                                   }
                               }
                               title='Session Expired - Please Re-login'
                               prompts='Your session has expired. To continue using our services, please re-login to your account.'
                               option1='OK'
                               option2='Cancel'/>
                <SnackBlogbar open={openbar} setOpen={setOpenbar} message={caution}/>
            </Grid>
        </Grid>
    </ExampleProvider>
}
export default BlogPage
