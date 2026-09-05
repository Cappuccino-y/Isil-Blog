import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import formatDate from "../utils/formatDate";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import {useContext, useEffect, useRef, useState} from "react";
import ExampleContext from "./ExampleContext";
import DialogForBlog from "./DialogForBlog";
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import Fade from '@mui/material/Fade';


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
            <ListItem alignItems="flex-start">
                <ListItemText
                    primary={comment.name}
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
                                    sx={{display: 'inline'}}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                >
                                    {comment.content}
                                </Typography>}
                            <br/>
                            {formatDate(comment.date)}
                        </>
                    }
                />
                {val.user.name === comment.name ? <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(comment.id)}>
                        <EditIcon/>
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => setOpen(true)}>
                        <DeleteIcon/>
                    </IconButton>
                </ListItemSecondaryAction> : <></>}
            </ListItem>
            <Divider variant="inset" component="li"/>
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

const Comment = ({comments, handleDelete, handleAddComment}) => {

    const handleInputChange = (event) => {
        setCommentText(event.target.value);
    }

    const handleSubmit = () => {
        handleAddComment(commentText);
        setCommentText('');
    }

    const [commentText, setCommentText] = React.useState('');
    const val = useContext(ExampleContext)
    const commentShow = val.blog ? true : false


    return (<Card
            sx={{
                marginTop: '2vh',
                padding: '0vh',
                backgroundImage: !commentShow ? 'url(bgComments.jpg)' : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '24px',
                height: '68vh'
            }}
        >
            <div style={{height: '70%'}}>
                <CSSTransition
                    in={commentShow}
                    timeout={300}
                    classNames="listTransition"
                    unmountOnExit
                >
                    <List
                        className='slide'
                        sx={{
                            width: '100%',
                            maxWidth: 450,
                            bgcolor: 'background.paper',
                            height: '100%',
                            overflowY: 'auto'
                        }}
                    >
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
                </CSSTransition>
            </div>
            <div style={{height: '30%', display: 'flex', flexDirection: 'column'}}>
                <Fade in={commentShow} timeout={500}>
                    <Paper
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            gap: 2,
                            p: 2,
                            bgcolor: 'background.paper',
                            padding: '0 10px ',
                            boxShadow: 'none'
                        }}
                    >
                        <TextField
                            variant="outlined"
                            fullWidth
                            multiline
                            id="comment"
                            label="Some words"
                            name="comment"
                            value={commentText}
                            onChange={handleInputChange}
                            inputProps={{
                                style: {height: "7vh"}
                            }}
                            style={{marginTop: '4vh'}}
                        />
                        <Button
                            type="submit"
                            variant="outlined"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </Paper>
                </Fade>
            </div>
        </Card>

    );
}
export default Comment;
