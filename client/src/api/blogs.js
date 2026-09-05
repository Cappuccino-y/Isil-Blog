import axios from 'axios'

const baseUrl = process.env.REACT_APP_BASEURL + 'blogs'


let token = null

const setToken = newToken => {
    token = `bearer ${newToken}`
}
const getAll = async () => {
    const config = {
        headers: {Authorization: token},
    }
    const request = axios.get(baseUrl, config)
    return request.then(response => response.data)
}
const update = (id, newObject) => {
    const config = {
        headers: {Authorization: token},
    }
    const request = axios.put(`${baseUrl}/${id}`, newObject, config)
    return request.then(response => response.data)
}

const create = async newObject => {
    const config = {
        headers: {Authorization: token},
    }
    const response = await axios.post(baseUrl, newObject, config)
    return response.data
}


const del = async id => {
    const config = {
        headers: {Authorization: token},
    }
    const request = await axios.delete(`${baseUrl}/${id}`, config)
    return request.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {getAll, create, setToken, del, update}