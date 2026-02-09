import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

const getAllCountries = () => {
    const response = axios.get(`${baseUrl}/all`)
    return response.then(res => res.data)
}

export default { getAllCountries }