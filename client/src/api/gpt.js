import axios from 'axios'

const baseUrl = process.env.REACT_APP_BASEURL + 'ai/chat'

let token = null

const setToken = newToken => {
    token = `bearer ${newToken}`
}

const getReply = async messages => {
    const config = {
        headers: {Authorization: token},
    }
    const response = await axios.post(baseUrl, {messages}, config)
    return response.data.reply
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {getReply, setToken}
