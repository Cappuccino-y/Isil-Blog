import Blog from "./Blog";
import {useState, useEffect, useRef, useContext} from "react";
import {
    Typography,
    Pagination,
    Box,
    useMediaQuery, useTheme
} from '@mui/material'
import blogService from "../api/blogs";
import ExampleContext from "./ExampleContext";
import {CSSTransition, TransitionGroup} from 'react-transition-group';

const MOON_FONT = "'Cinzel','Noto Serif SC','Source Han Serif SC','STZhongsong','SimSun',serif";

const BlogShow = ({isPrivate, user, deleteItem, updateBlog, blogs, buttonColor, stateListen}) => {
    let res = [];
    blogs = blogs.map(blog => !blog.likes ? {...blog, likes: 0} : blog)
    const privateBlogs = blogs.filter(blog => blog.user.username === user.username)
    if (isPrivate) {
        if (buttonColor !== 'grey') {
            res = privateBlogs.slice().sort((a, b) => {
                return b.likes - a.likes
            })
        } else {
            res = [...privateBlogs]
        }
    } else {
        if (buttonColor !== 'grey') {
            res = blogs.slice().sort((a, b) => {
                return b.likes - a.likes
            })
        } else {
            res = [...blogs]
        }
    }
    res = res.filter(blog => (blog.visible.includes('public') ||
        blog.visible.includes(user.name) || blog.user.name === user.name))
    const [page, setPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(7);
    const [loading, setLoading] = useState(false)
    const listRef = useRef(null);
    const val = useContext(ExampleContext)
    const handlePageChange = (event, value) => setPage(value);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const debounceTimeout = useRef(null);

    const fetchBlogs = async () => {
        try {
            const res = await blogService.getAll()
            val.setBlogs(res.reverse())
        } catch {
            if (user) {
                val.setOpenExpire(true)
            }
        }
    }

    const handleWheel = (e) => {
        if (listRef.current.scrollTop === 0 && page === 1 && e.deltaY < 0) {
            setLoading(true)
            fetchBlogs()
        }
    };

    const debounce = (func, delay) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = (setTimeout(func, delay));
    }
    const handleScroll = (e) => {
        if (listRef.current.scrollTop === 0 && page === 1) {
            setLoading(true)
            fetchBlogs()
        }
    };

    useEffect(() => {
        setTimeout(() => setLoading(false), 2000)
    }, [val.blogs])

    useEffect(() => {
        const container = listRef.current;
        if (container) {
            if (!isMobile) {
                container.addEventListener('wheel', (e) => debounce(() => handleWheel(e), 500));
            }
            if (isMobile) {
                container.addEventListener('scroll', (e) => debounce(() => handleScroll(e), 500));
            }
        }

        return () => {
            if (container) {
                if (!isMobile) {
                    container.removeEventListener('wheel', (e) => debounce(() => handleWheel(e), 500));
                }
                if (isMobile) {
                    container.removeEventListener('scroll', (e) => debounce(() => handleScroll(e), 500));
                }
            }
        };

    }, [page]);

    useEffect(() => {
        if (page > Math.ceil(res.length / postsPerPage)) setPage(Math.ceil(res.length / postsPerPage))
        else if (page == 0) setPage(1)
    }, [res.length])

    const shown = res.slice((page - 1) * postsPerPage, page * postsPerPage)

    /* 期刊列表：行卡 + 底部 pill 分页（在左栏 flex 链内滚动） */
    return <Box sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        flex: {md: '1 1 0', xs: '0 0 auto'},
        minHeight: {md: 0},
    }}>
        <Box className='slide' ref={listRef} sx={{
            flex: {md: '1 1 0', xs: '0 0 auto'},
            height: {xs: '70vh', md: 0},
            minHeight: 0,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: .25,
            pr: .5,
        }}>
            {loading && (
                <Box sx={{display: 'flex', justifyContent: 'center', py: 2}}>
                    <Box sx={{display: 'flex', gap: .5}}>
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </Box>
                </Box>
            )}
            <TransitionGroup component={null}>
                {shown.map((blog, idx) =>
                    <CSSTransition
                        key={blog.id}
                        timeout={300}
                        classNames="item"
                    >
                        <Box className="moon-stagger-item" sx={{animationDelay: `${Math.min(idx * 60, 420)}ms`}}>
                            <Blog blog={blog}/>
                        </Box>
                    </CSSTransition>
                )}
            </TransitionGroup>
            {!loading && shown.length === 0 && (
                <Box sx={{py: 5, textAlign: 'center'}}>
                    <Typography sx={{
                        fontFamily: MOON_FONT, fontStyle: 'italic',
                        fontSize: '1rem', color: '#6E7B91',
                    }}>
                        还没有可见的故事
                    </Typography>
                </Box>
            )}
        </Box>
        <Box sx={{
            mt: 1.25,
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'center',
        }}>
            <Pagination
                count={Math.ceil(res.length / postsPerPage)}
                page={page}
                onChange={handlePageChange}
                sx={{
                    px: 2,
                    py: 0.5,
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,.6)',
                    border: '1px solid #D7DDE7',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    boxShadow: '0 4px 16px rgba(28,35,51,.08)',
                    '& .MuiPaginationItem-page.Mui-selected': {
                        backgroundColor: '#4C5871',
                        color: '#ffffff',
                    },
                    '& .MuiPaginationItem-page.Mui-selected:hover': {
                        backgroundColor: '#B08D57',
                    },
                    '& .MuiPaginationItem-page:hover': {
                        backgroundColor: '#F4F6FA',
                    }
                }}
            />
        </Box>
    </Box>
}
export default BlogShow
