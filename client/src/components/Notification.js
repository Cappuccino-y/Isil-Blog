import {Alert} from "@mui/material";

const Notification = ({message}) => {
    return (message.content &&
        <Alert className='fixedTop' severity={message.sign}>
            {message.content}
        </Alert>
    )
}

export default Notification