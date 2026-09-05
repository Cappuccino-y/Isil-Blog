import axios from 'axios'

const baseUrl = process.env.REACT_APP_BASEURL + 'users'
const update = async (username, newPassword) => {
    const response = await axios.put(`${baseUrl}/${username}`, {newPassword})
    return response.data
}

const create = async newObject => {
    const response = await axios.post(baseUrl, newObject)
    return response.data
}

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}
export default {update, getAll, create}