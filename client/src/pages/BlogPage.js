import {useEffect, useState} from "react";
import Togglable from "../components/Togglable";
import BlogForm from "../components/BlogForm";
import BlogShow from "../components/BlogShow";
import Notification from "../components/Notification";
import {useNavigate} from "react-router-dom";
import {Grid, Typography, Button, Box, Divider,} from '@mui/material';
import {Select, MenuItem, TextField, IconButton, FormControl, OutlinedInput} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import blogService from "../api/blogs";
import imageService from '../api/images';
import {useTheme} from '@mui/material/styles';
import {useMediaQuery} from '@mui/material'
import DialogForBlog from "../components/DialogForBlog";
import {ExampleProvider} from "../components/ExampleContext";
import SnackBlogbar from "../components/SnackBlogbar";


const BlogPage = ({user, message, blogFormRef, setUser, notice, users}) => {

// In your component
//     const theme = useTheme();
// const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [blogs, setBlogs] = useState([])
    const [isPrivate, setisPrivate] = useState(false)
    const [buttonColor, setButtonColor] = useState('grey')
    const [searchOption, setSearchOption] = useState('title');
    const [searchText, setSearchText] = useState('');
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [open, setOpen] = useState(false);
    const [openbar, setOpenbar] = useState(false)
    const [caution, setCaution] = useState('')
    const [openExpire, setOpenExpire] = useState(false);
    const [blogId, setBlogId] = useState('')

    const navigate = useNavigate()
    const blog = blogs.find(blog => blog.id === blogId)


    const sortedByLikes = () => {
        setButtonColor(buttonColor === 'grey' ? '#00a7d0' : 'grey');
    }
    const blogsShow = blogs.filter(blog => blog[searchOption].toLowerCase().includes(searchText.toLowerCase()))
    const addBlog = (blogObject) => {
        blogFormRef.current.toggleVisibility()
        const newValue = blogObject
        blogService.create(newValue).then(response => {
            setBlogs([response, ...blogs])
            // notice("Blog add success", 'success')
            setCaution('Blog add success')
            setOpenbar(true)
        }).catch(error => {
            notice(`Blog add failed`, 'error')
            console.log(error)
        })
    }

    const logOut = (navigate) => {
        window.localStorage.removeItem('loggedBlogappUser')
        setUser(null)
        navigate("/login")
    }

    const updateBlog = async (blog) => {
        try {
            const updatedBlog = await blogService.update(blog.id, blog)
            setBlogs(blogs.map(b => b.id !== updatedBlog.id ? b : updatedBlog))
        } catch (error) {
            notice('Update failed', 'error')
        }
    }
    const deleteItem = (id, pagination) => {
        const target = blogs.find(blog => blog.id === id)
        const delItem = async () => {
            try {
                await blogService.del(id)
                if ((blogs.length - 1) % pagination.postsPerPage === 0 && (blogs.length - 1) / pagination.postsPerPage === pagination.page - 1) {
                    pagination.setPage(pagination.page - 1)
                }
                setBlogs(blogs.filter(blog => blog.id !== id))
                // notice('Delete success', 'success')
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
    return <Grid container className={'animation-blog'} spacing={2} sx={{minHeight: '96vh'}}>
        <Grid item md={4.5} xs={12}>
            <Box display="flex" flexDirection="column" justifyContent="space-between" p={2}>
                <Box>
                    <Typography variant="h4" component="h1"
                                sx={{color: '#191970', fontFamily: 'Pacifico', fontSize: '2em'}}>
                        Isil nar caluva tielyanna
                    </Typography>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: "center",
                        paddingTop: '2vh'
                    }}>
                        <Typography variant="h5" fontFamily="Comic Sans MS, cursive, sans-serif">
                            {user.name} logged in
                        </Typography>
                        <Button variant="outlined" startIcon={<ExitToAppIcon/>} onClick={() => setOpen(true)}>
                            Sign out
                        </Button>
                    </div>
                </Box>

                <Box marginTop='0vh'>
                    <DialogForBlog open={open} setOpen={setOpen}
                                   handleEvents={
                                       () => logOut(navigate)
                                   }
                                   title='Ready to Sign Out Safely?'
                                   prompts='Remember that logging out will redirect you to the log-in page.'
                                   option1='Yes'
                                   option2='Cancel'/>
                    <Divider sx={{my: 2}} style={{marginBottom: '0px'}}/>
                    <ExampleProvider val={{blog, updateBlog, user, blogs, users, addBlog}}>
                        <Togglable buttonLabel='new blog' ref={blogFormRef} blog={blog}
                                   updateBlog={updateBlog} user={user} blogs={blogs}>
                            <BlogForm createBlog={addBlog}/>
                        </Togglable>
                    </ExampleProvider>
                </Box>
                <Notification message={message}/>
            </Box>
        </Grid>
        <Grid item md={7.5} xs={12}>
            <Box my={2} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '4px'}}>
                <Grid container spacing={2} xs={12} margin='4px 0 0 0'>
                    <Grid item md={6} style={{paddingLeft: '0px', paddingTop: '14px'}}>
                        <Button style={{
                            marginRight: 10
                        }}
                                variant="outlined"
                                onClick={() => setisPrivate(false)}>
                            Public
                        </Button>
                        <Button style={{marginRight: 10}} variant="outlined" onClick={() => setisPrivate(true)}>
                            Private
                        </Button>
                        <Button variant="contained" onClick={sortedByLikes}
                                style={{backgroundColor: buttonColor, marginRight: 10}}>
                            Sorted
                        </Button>
                    </Grid>
                    <Grid item md={6} xs={12} style={{paddingTop: '14px', paddingLeft: '0px'}}>
                        <Select
                            value={searchOption}
                            onChange={event => {
                                setSearchOption(event.target.value)
                            }}
                            sx={{
                                width: '105px', textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap'
                            }}
                            size='small'
                        >
                            <MenuItem value={'title'}>Title</MenuItem>
                            <MenuItem value={'content'}>Content</MenuItem>
                            <MenuItem value={'tag'}>Tag</MenuItem>
                        </Select>
                        <TextField
                            variant="outlined"
                            placeholder="Search..."
                            onChange={event => {
                                setSearchText(event.target.value)
                            }}
                            InputProps={{
                                endAdornment: (
                                    <IconButton>
                                        <SearchIcon/>
                                    </IconButton>
                                ),
                            }}
                            sx={{marginLeft: 0, height: 1}} size='small'
                        />
                    </Grid>
                </Grid>
            </Box>
            <ExampleProvider
                val={{blogs, setBlogs, setOpenExpire, blogId, setBlogId, updateBlog}}>
                <BlogShow isPrivate={isPrivate} buttonColor={buttonColor} stateListen={blogs}
                          deleteItem={deleteItem} blogs={blogsShow} updateBlog={updateBlog} user={user}
                />
            </ExampleProvider>
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
}
export default BlogPage