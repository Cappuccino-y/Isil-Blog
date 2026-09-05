import {Dialog, DialogActions, DialogTitle, Button, DialogContent, DialogContentText} from "@mui/material";
import {useState} from "react";

const DialogForBlog = ({open, setOpen, handleEvents, title, prompts, option1, option2}) => {
    const handleClose = () => {
        setOpen(false)
    }
    return <div>
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    {prompts}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    handleEvents()
                    handleClose()
                }}>
                    {option1}
                </Button>
                <Button onClick={handleClose}>
                    {option2}
                </Button>
            </DialogActions>
        </Dialog>
    </div>
}
export default DialogForBlog