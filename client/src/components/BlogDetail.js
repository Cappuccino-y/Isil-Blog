import {useState, useEffect} from "react";
import {
    Typography,
    Box,
    IconButton,
    Badge,
    Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import SellIcon from '@mui/icons-material/Sell';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import MDEditor from '@uiw/react-md-editor';
import 'font-awesome/css/font-awesome.min.css'
import customImageCommand from "../utils/customImageCommand";
import DialogForBlog from "./DialogForBlog";
import Comment from "./Comment";
import formatDate from "../utils/formatDate";
import Code from './Code'
import {v4 as uuidv4} from 'uuid';

const MOON_FONT = "'Cinzel','Noto Serif SC','Source Han Serif SC','STZhongsong','SimSun',serif";
const BODY_FONT = "'EB Garamond','Noto Serif SC','Source Han Serif SC','STZhongsong','SimSun',serif";
const UI_FONT = "'Roboto','Helvetica','Arial',sans-serif";

/* 阅读面板：banner + 标题/操作 + 正文 + 评论 */
const BlogDetail = ({blog, deleteItem, isPrivate, updateBlog, pagination, user}) => {
    const [editMode, setEditMode] = useState(false)
    const [updateValue, setUpdateValue] = useState({...blog})
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setUpdateValue({...blog})
        if (editMode) {
            setEditMode(false);
        }
    }, [blog]); // 换文或数据变更时退出编辑态并刷新草稿

    const editBlog = async () => {
        if (editMode) {
            try {
                await updateBlog({...updateValue})
            } catch (error) {
                console.log(error)
            }
        } else {
            setEditMode(!editMode)
        }
    }

    const handleDeleteComment = async (id) => {
        try {
            const comments = blog.comments.filter(comment => comment.id !== id)
            await updateBlog({...blog, comments})
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddComment = async (commentText) => {
        try {
            const comments = [{
                name: user.name,
                content: commentText,
                id: uuidv4(),
                date: new Date()
            }, ...blog.comments]
            await updateBlog({...blog, comments})
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Box className="moon-glass" sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            p: 0,
        }}>
            {/* Banner：白城插画 + 标题叠加 */}
            <Box sx={{
                position: 'relative',
                height: 148,
                flexShrink: 0,
            }}>
                <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'url(bgComments.jpg) center / cover no-repeat',
                }}/>
                <Box aria-hidden="true" sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(rgba(244,246,250,.15), rgba(244,246,250,.92) 88%)',
                }}/>
                <Box sx={{
                    position: 'absolute',
                    left: 0, right: 0, bottom: 8,
                    px: 3,
                }}>
                    <Typography sx={{
                        fontFamily: MOON_FONT,
                        fontWeight: 600,
                        fontSize: {md: '1.5rem', xs: '1.2rem'},
                        color: '#1C2333',
                        letterSpacing: '.03em',
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}>
                        {blog.title}
                    </Typography>
                </Box>
            </Box>

            {/* Meta + 操作行 */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                flexWrap: 'wrap',
                px: 3,
                pt: 1,
                flexShrink: 0,
            }}>
                <Box sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: .5,
                    px: 1.25,
                    borderRadius: '999px',
                    background: 'rgba(176,141,87,.12)',
                    border: '1px solid rgba(176,141,87,.32)',
                }}>
                    <SellIcon sx={{fontSize: 13, color: '#B08D57'}}/>
                    <Typography sx={{fontFamily: UI_FONT, fontSize: '12px', color: '#8A6D42',
                                     maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                        {blog.tag}
                    </Typography>
                </Box>
                <Typography sx={{fontFamily: 'Roboto', fontSize: '12px', color: '#6E7B91'}}>
                    {formatDate(blog.date)}
                </Typography>
                <Typography sx={{fontFamily: BODY_FONT, fontStyle: 'italic', fontSize: '13px', color: '#4C5871'}}>
                    by {blog.user.name}
                </Typography>

                <Box sx={{ml: 'auto', display: 'flex', alignItems: 'center', gap: .5}}>
                    <IconButton size="small" className="moon-like-btn" onClick={() => {
                        const likes = (!blog.likes ? 1 : blog.likes + 1)
                        updateBlog({...blog, likes})
                    }}>
                        <Badge badgeContent={blog.likes === undefined ? 0 : blog.likes} color="error">
                            <ThumbUpIcon sx={{fontSize: 19}}/>
                        </Badge>
                    </IconButton>
                    <IconButton size="small" onClick={() => {
                        if (blog.likes !== undefined && blog.likes > 0) {
                            updateBlog({...blog, likes: blog.likes - 1})
                        }
                    }}>
                        <ThumbDownIcon sx={{fontSize: 19}}/>
                    </IconButton>
                    {isPrivate && <Button size="small" variant="outlined" onClick={editBlog}
                                          startIcon={editMode ? <CancelIcon/> : <EditIcon/>}
                                          sx={{minWidth: 0, px: 1.25, fontSize: '12px'}}>
                        {editMode ? 'Enter' : 'Edit'}
                    </Button>}
                    {isPrivate && <IconButton size="small" onClick={() => setOpen(true)}
                                              sx={{color: '#B3564C'}}>
                        <DeleteIcon sx={{fontSize: 19}}/>
                    </IconButton>}
                    <DialogForBlog open={open} setOpen={setOpen}
                                   handleEvents={() => {
                                       deleteItem(blog.id, pagination)
                                   }}
                                   title='Caution: Irreversible Action - Delete this Item?'
                                   prompts='The following operation is irreversible. Please exercise caution before.'
                                   option1='Yes'
                                   option2='Cancel'/>
                </Box>
            </Box>

            {/* 正文 */}
            <Box className='slide' sx={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                px: 3,
                pt: 2,
            }}>
                {editMode && isPrivate ?
                    <MDEditor
                        value={updateValue.content}
                        onChange={content => setUpdateValue({...updateValue, content})}
                        height={420}
                        commandsFilter={(command, isExtra) => {
                            if (command.name === 'image') {
                                return customImageCommand;
                            }
                            return command;
                        }}
                        previewOptions={{
                            components: {
                                code: Code
                            },
                        }}
                    />
                    :
                    <Box className="modifytext" component="div"
                         sx={{fontFamily: BODY_FONT, pb: 1}}>
                        <MDEditor.Markdown source={blog.content} components={{
                            code: Code
                        }} style={{whiteSpace: 'pre-wrap', backgroundColor: 'transparent'}}/>
                    </Box>}
            </Box>

            {/* 评论 */}
            <Box sx={{px: 3, pb: 2.5, flexShrink: 0}}>
                <Comment
                    comments={blog.comments ? blog.comments : []}
                    handleDelete={handleDeleteComment}
                    handleAddComment={handleAddComment}
                />
            </Box>
        </Box>
    )
}

export default BlogDetail
