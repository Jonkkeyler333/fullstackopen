import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    const response = axios.get(baseUrl)
    return response.then(response => response.data)
}

const addEntry = (newObject) => {
    const response = axios.post(baseUrl, newObject)
    return response.then(response => response.data)
}

const deleteEntry = (id) => {
    const response = axios.delete(`${baseUrl}/${id}`)
    return response.then(response => response.data)
}

const updateEntry = (id, newObject) =>{
    const response = axios.put(`${baseUrl}/${id}`, newObject)
    return response.then(response => response.data)
}

export default { getAll, addEntry, deleteEntry, updateEntry }