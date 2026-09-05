import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import formatDate from "../utils/formatDate";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import {useContext, useEffect, useState} from "react";
import ExampleContext from "./ExampleContext";
import DialogForBlog from "./DialogForBlog";
import {TransitionGroup, CSSTransition} from 'react-transition-group';

const MOON_FONT = "'Cinzel','Noto Serif SC','Source Han Serif SC','STZhongsong','SimSun',serif";
const BODY_FONT = "'EB Garamond','Noto Serif SC','Source Han Serif SC','STZhongsong','SimSun',serif";

const CommentItem = ({comment, handleDelete}) => {
    const [updateValue, setUpdateValue] = useState(comment.content)
    const [editMode, setEditMode] = useState(false)
    const [open, setOpen] = useState(false)
    const val = useContext(ExampleContext)

    useEffect(() => {
        setEditMode(false);
    }, [val.blog])

    const handleEdit = async (id) => {
        if (editMode) {
            try {
                const updateComment = {...comment, content: updateValue}
                const updateBlog = {
                    ...val.blog,
                    comments: val.blog.comments.map(comment => comment.id === id ? updateComment : comment)
                }
                await val.updateBlog(updateBlog)
            } catch (error) {
                console.log(error)
            }
        } else {
            setEditMode(!editMode)
        }
    }

    return (
        <React.Fragment>
            <ListItem alignItems="flex-start" sx={{px: 0}}>
                <ListItemText
                    primary={comment.name}
                    primaryTypographyProps={{
                        sx: {fontFamily: BODY_FONT, fontWeight: 600, fontSize: '.95rem', color: '#4C5871'},
                    }}
                    secondary={
                        <>
                            {editMode ?
                                <TextField label="Content" fullWidth
                                           multiline margin="normal" value={updateValue}
                                           size='small' sx={{width: '92%'}}
                                           onChange={(event) => {
                                               setUpdateValue(event.target.value)
                                           }}/> :
                                <Typography
                                    sx={{display: 'inline', fontFamily: BODY_FONT, fontSize: '.92rem'}}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                >
                                    {comment.content}
                                </Typography>}
                            <br/>
                            <Typography component="span" sx={{fontFamily: 'Roboto', fontSize: '11px', color: '#6E7B91'}}>
                                {formatDate(comment.date)}
                            </Typography>
                        </>
                    }
                />
                {val.user.name === comment.name ? <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="edit" size="small" onClick={() => handleEdit(comment.id)}>
                        <EditIcon fontSize="small"/>
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" size="small" onClick={() => setOpen(true)}>
                        <DeleteIcon fontSize="small"/>
                    </IconButton>
                </ListItemSecondaryAction> : <></>}
            </ListItem>
            <Divider variant="inset" component="li" sx={{borderColor: 'rgba(215,221,231,.7)'}}/>
            <DialogForBlog open={open} setOpen={setOpen}
                           handleEvents={
                               () => handleDelete(comment.id)
                           }
                           title='Caution: Irreversible Action - Delete this Item?'
                           prompts='The following operation is irreversible. Please exercise caution before.'
                           option1='Yes'
                           option2='Cancel'/>
        </React.Fragment>
    );
}

/* 阅读面板内的评论区：计数 + 列表 + 发言行 */
const Comment = ({comments, handleDelete, handleAddComment}) => {
    const [commentText, setCommentText] = React.useState('');
    const val = useContext(ExampleContext)

    const handleInputChange = (event) => {
        setCommentText(event.target.value);
    }

    const handleSubmit = () => {
        if (!commentText.trim()) return
        handleAddComment(commentText);
        setCommentText('');
    }

    return (
        <Box sx={{mt: 2.5}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1.25, mb: 1}}>
                <Typography sx={{
                    fontFamily: MOON_FONT,
                    fontWeight: 600,
                    fontSize: '1.05rem',
                    color: '#1C2333',
                    letterSpacing: '.03em',
                }}>
                    Whispers
                </Typography>
                <Typography sx={{
                    fontFamily: 'Roboto', fontSize: '11px',
                    letterSpacing: '.18em', textTransform: 'uppercase',
                    color: '#B08D57',
                }}>
                    {comments.length} whispers
                </Typography>
                <Box aria-hidden="true" sx={{
                    flex: 1, height: 1,
                    background: 'linear-gradient(90deg, rgba(176,141,87,.5), rgba(176,141,87,0))',
                }}/>
            </Box>
            <List className='slide' sx={{
                width: '100%',
                maxHeight: {md: '38vh', xs: '50vh'},
                overflowY: 'auto',
                py: 0,
            }}>
                <TransitionGroup>
                    {comments.map(comment =>
                        <CSSTransition
                            key={comment.id}
                            timeout={300}
                            classNames="item"
                        >
                            <CommentItem comment={comment} handleDelete={handleDelete}/>
                        </CSSTransition>
                    )}
                </TransitionGroup>
            </List>
            <Box component="form" onSubmit={(e) => {e.preventDefault(); handleSubmit();}} sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                mt: 1.5,
                px: 1.5,
                py: .75,
                borderRadius: '999px',
                border: '1px solid #D7DDE7',
                background: 'rgba(255,255,255,.8)',
            }}>
                <TextField
                    variant="standard"
                    fullWidth
                    placeholder="留下一段耳语…"
                    value={commentText}
                    onChange={handleInputChange}
                    InputProps={{disableUnderline: true,
                                 style: {fontFamily: BODY_FONT, fontSize: '15px'}}}
                    multiline
                    maxRows={3}
                    sx={{'& .MuiInputBase-root': {py: .5}}}
                />
                <IconButton onClick={handleSubmit} size="small"
                            sx={{
                                color: '#4C5871',
                                flexShrink: 0,
                                '&:hover': {color: '#B08D57', background: 'rgba(176,141,87,.1)'},
                            }}>
                    <SendIcon fontSize="small"/>
                </IconButton>
            </Box>
        </Box>
    );
}

export default Comment
