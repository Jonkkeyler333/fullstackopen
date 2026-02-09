import axios from 'axios'

const api_key = import.meta.env.VITE_SOME_KEY
const baseURL = `https://api.openweathermap.org/data/2.5/weather`

const getWeather = (capital) => {
    console.log(`Fetching weather for ${capital} with API key ${api_key}`)
    const params = {q: capital, appid: api_key, units: 'metric'}
    return axios.get(baseURL, {params: params})
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching weather:', error)
            throw error
        })
}

export default {getWeather}