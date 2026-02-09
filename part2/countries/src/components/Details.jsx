import { useState, useEffect } from 'react'
import weatherService from '../services/weather'

const Details = ({country}) =>{
    const [weather, setWeather] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        weatherService.getWeather(country.capital[0])
            .then(data => {
                setWeather(data)
                setError(null)
            })
            .catch(error => {
                console.error('Error fetching weather data:', error)
                setError('Could not load weather data')
            })
    }, [country.capital])    

    return(
        <div>
            <h2>{country.name.common}</h2>
            <p>capital {country.capital[0]}</p>
            <p>area {country.area}</p>
            <h2>Languages</h2>
            <ul>
                {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
            </ul>
            <img src={country.flags.png} alt={`flag of ${country.name.common}`}/>
            <h2>Weather in {country.capital[0]}</h2>
            {error && <p>{error}</p>}
            {weather && (
                <>
                    <p>temperature {weather.main.temp} Celsius</p>
                    <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather icon"/>
                    <p>wind {weather.wind.speed} m/s</p>
                </>
            )}
        </div>
    )
}

export default Details