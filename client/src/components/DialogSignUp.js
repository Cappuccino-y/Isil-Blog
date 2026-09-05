import React, {useContext, useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import ExampleContext from "./ExampleContext";
import SnackBlogbar from "./SnackBlogbar";

function DialogSignUp() {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState({username: '', password: '', inviteCode: '', name: ''})
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [message, setMessage] = useState('');
    const val = useContext(ExampleContext)
    const inviteCode = 'Lyy121200@'
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirm = () => {
        if (user.inviteCode !== inviteCode) {
            setMessage('Please contact with the adminstrator to get the correct invite code')
            setSnackbarOpen(true)
            setOpen(false)
            return
        }
        if (user.username === 'public' || user.name === 'public') {
            setMessage('Unsupport characters in username or name')
            setSnackbarOpen(true)
            setOpen(false)
            return
        }
        val.handleSignUp(user, setSnackbarOpen, setMessage)
        setOpen(false)
    }
    return (
        <div>
            <Button variant="contained" color="inherit" onClick={handleClickOpen}
                    sx={{
                        fontFamily: 'Georgia, serif',
                        fontSize: '1.2em',
                        marginLeft: '1vh',
                        backgroundColor: '#191970',
                        '&:hover': {
                            backgroundColor: '#000080',
                            color: 'white'
                        },
                        color: 'white'
                    }}>
                SignUp
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Sign Up</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your username, password, and invite code.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="username"
                        label="Username"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            setUser({...user, username: event.target.value})
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            setUser({...user, password: event.target.value})
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            setUser({...user, name: event.target.value})
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="inviteCode"
                        label="Invite Code"
                        type="text"
                        fullWidth
                        required
                        variant="standard"
                        onChange={(event) => {
                            setUser({...user, inviteCode: event.target.value})
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirm}>Sign Up</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <SnackBlogbar message={message} open={snackbarOpen} setOpen={setSnackbarOpen}/>
        </div>
    );
}

export default DialogSignUp;
