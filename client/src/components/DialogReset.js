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

function DialogReset() {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState({username: '', oldPassword: '', newPassword: '', confirmPassword: ''})
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [message, setMessage] = useState('');
    const val = useContext(ExampleContext)


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleConfirm = () => {
        if (user.newPassword !== user.confirmPassword || user.newPassword === user.oldPassword) {
            setUser({username: '', oldPassword: '', newPassword: '', confirmPassword: ''})
            setOpen(false)
            setMessage('Please check your new password to be the same')
            setSnackbarOpen(true)
            return
        }
        val.handleReset(user, setSnackbarOpen, setMessage)
        setOpen(false)
    }


    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleClickOpen}
                    sx={{fontFamily: 'Georgia, serif', fontSize: '1.2em'}}>
                Reset
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your username, old password, then your new password twice.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="username"
                        label="Username"
                        fullWidth
                        variant="standard"
                        onChange={(event) => setUser({...user, username: event.target.value})}
                    />
                    <TextField
                        margin="dense"
                        id="oldPassword"
                        label="Old Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        onChange={(event) => setUser({...user, oldPassword: event.target.value})}
                    />
                    <TextField
                        margin="dense"
                        id="newPassword1"
                        label="New Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        onChange={(event) => setUser({...user, newPassword: event.target.value})}
                    />
                    <TextField
                        margin="dense"
                        id="newPassword2"
                        label="Confirm New Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        onChange={(event) => setUser({...user, confirmPassword: event.target.value})}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirm}>Confirm</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <SnackBlogbar message={message} open={snackbarOpen} setOpen={setSnackbarOpen}/>
        </div>
    );
}

export default DialogReset;
