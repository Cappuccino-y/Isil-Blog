import Blog from "./Blog";
import {useState, useEffect, useRef, useContext} from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper, Typography, Pagination,
    useMediaQuery, useTheme
} from '@mui/material'
// import CircularProgress from '@mui/material/CircularProgress';
import blogService from "../api/blogs";
import ExampleContext from "./ExampleContext";
import {CSSTransition, TransitionGroup} from 'react-transition-group';

const BlogShow = ({isPrivate, user, deleteItem, updateBlog, blogs, buttonColor, stateListen}) => {
    let res = [];
    blogs = blogs.map(blog => !blog.likes ? {...blog, likes: 0} : blog)
    const privateBlogs = blogs.filter(blog => blog.user.username === user.username)
    const editRef = useRef(null)
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
    const tableContainerRef = useRef(null);
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
        if (tableContainerRef.current.scrollTop === 0 && page === 1 && e.deltaY < 0 && !editRef.current) {
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
        if (tableContainerRef.current.scrollTop === 0 && page === 1 && !editRef.current) {
            setLoading(true)
            fetchBlogs()
        }
    };

    useEffect(() => {
        setTimeout(() => setLoading(false), 2000)
    }, [val.blogs])

    useEffect(() => {
        const container = tableContainerRef.current;
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

    return <div>
        <TableContainer
            className='slide' component={Paper}
            sx={{
                height: '80vh',
                overflowY: 'auto',
                backgroundColor: 'transparent',
            }}
            ref={tableContainerRef}>
            <Table>
                <TableBody>
                    <TableRow style={{display: loading ? '' : 'none'}}>
                        <TableCell colSpan={2} style={{textAlign: 'center'}}>
                            <div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                            </div>
                        </TableCell>
                    </TableRow>
                    <TransitionGroup component={null}>
                        {res.slice((page - 1) * postsPerPage, page * postsPerPage).map(blog =>
                            <CSSTransition
                                key={blog.id}
                                timeout={300}
                                classNames="item"
                            >
                                <TableRow>
                                    <TableCell style={{width: '100%'}}>
                                        <Blog blog={blog} isPrivate={isPrivate} blogs={stateListen}
                                              pagination={{page: page, setPage: setPage, postsPerPage: postsPerPage}}
                                              deleteItem={deleteItem} updateBlog={updateBlog} editRef={editRef}
                                        />
                                    </TableCell>
                                </TableRow>
                            </CSSTransition>
                        )}
                    </TransitionGroup>
                </TableBody>
            </Table>
        </TableContainer>
        <Pagination
            count={Math.ceil(res.length / postsPerPage)}
            page={page}
            onChange={handlePageChange}
            style={{marginTop: '10px', display: "flex", justifyContent: 'center'}}
            sx={{
                '& .MuiPaginationItem-page.Mui-selected': {
                    backgroundColor: '#f50057',
                    color: '#ffffff',
                },
                '& .MuiPaginationItem-page.Mui-selected:hover': {
                    backgroundColor: '#aa0039',
                },
                '& .MuiPaginationItem-page:hover': {
                    backgroundColor: '#f6f6f6',
                }
            }}
        />
    </div>
}
export default BlogShow