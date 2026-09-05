import React, {useContext, useEffect, useRef, useState} from 'react'
import {Box, Typography, TextField, Button, useTheme, useMediaQuery} from "@mui/material";
import {Autocomplete, Radio, RadioGroup, FormControlLabel} from '@mui/material';
import {Grid} from "@mui/material";
import MDEditor from '@uiw/react-md-editor';
import customImageCommand from "../utils/customImageCommand";
import ExampleContext from "./ExampleContext";

import Code from './Code'


const BlogForm = ({toggleVisibility}) => {
    const [newBlog, setNewBlog] = useState({title: '', content: '', tag: '', comments: [], visible: []})
    const [visibleUsers, setVisibleUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(null);
    const val = useContext(ExampleContext)
    const createBlog = val.addBlog
    const users = val.users ? val.users.map(user => ({
        label: user.name,
        value: user.name
    })).filter(user => user.value !== val.user.name) : []
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const submitConfirm = useRef(null)
    const handleChange = (event, newValue) => {
        setVisibleUsers(newValue)
    };


    const handleSelectAllChange = (event) => {
        setSelectAll(event.target.value);
        if (event.target.value === 'all') {
            setVisibleUsers(users);
        } else if (event.target.value === 'none') {
            setVisibleUsers([]);
        } else if (event.target.value === 'public') {
            setVisibleUsers([{label: 'Public', value: 'public'}]);
        }
    };

    useEffect(() => {
        if (submitConfirm.current) {
            createBlog({...newBlog})
            submitConfirm.current = false
            setNewBlog({title: '', content: '', tag: '', comments: [], visible: []})
        }
    }, [newBlog])

    const addBlog = (event) => {
        event.preventDefault()
        submitConfirm.current = true
        setNewBlog({...newBlog, visible: visibleUsers.map(val => val.value)});
        setSelectAll(null);
        setVisibleUsers([])
    }
    const handleBlogTitleChange = (event) => {
        setNewBlog({...newBlog, title: event.target.value})
    }
    const handleBlogContentChange = (event) => {
        setNewBlog({...newBlog, content: event.target.value})
    }
    const handleBlogTagChange = (event) => {
        setNewBlog({...newBlog, tag: event.target.value})
    }

    return <Box my={2} style={{marginTop: '0px'}}>
        {/*<Typography variant="h5" component="h2" gutterBottom>*/}
        {/*    Create*/}
        {/*</Typography>*/}
        <form onSubmit={addBlog}>
            <TextField label="Title" fullWidth margin="normal" size='small' value={newBlog.title}
                       onChange={handleBlogTitleChange}/>
            <MDEditor
                value={newBlog.content}
                onChange={content => setNewBlog({...newBlog, content})}
                height={isMobile ? '43vh' : '46vh'}
                commandsFilter={(command, isExtra) => {
                    if (command.name === 'image') {
                        // Replace the image command with your custom command
                        return customImageCommand;
                    }
                    // Return the command unchanged if it's not the image command
                    return command;
                }}
                previewOptions={{
                    components: {
                        code: Code
                    },
                }}
                // style={{backgroundColor: 'transparent'}}
            />
            <TextField label="Tag" style={{marginTop: '5%'}} value={newBlog.tag} fullWidth
                       onChange={handleBlogTagChange} size='small'/>
            <RadioGroup row value={selectAll} onChange={handleSelectAllChange}
            >
                <FormControlLabel value="all" control={<Radio size='small'/>} label="All"/>
                <FormControlLabel value="none" control={<Radio size='small'/>} label="None"/>
                <FormControlLabel value="public" control={<Radio size='small'/>} label="Pubic"/>
            </RadioGroup>
            <Autocomplete
                multiple
                options={users}
                getOptionLabel={(option) => option.label}
                value={visibleUsers}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} label='Visable users' variant="outlined"/>}
                size='small'
                style={{marginBottom: '5%', marginTop: '1%'}}
            />
            <Button variant="contained" type="submit" style={{marginRight: '3%'}}>save</Button>
            <Button variant='outlined' onClick={toggleVisibility}>cancel</Button>
        </form>
    </Box>
}
export default BlogForm