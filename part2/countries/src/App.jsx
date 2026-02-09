import { useState, useEffect } from 'react'
import countryService from './services/countries'
import Countries from './components/Countries'

const App = () => {
  const [countries, setCountries] = useState([])
  const [newCountry, setNewCountry] = useState('')

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      countryService.getAllCountries().then(data => {
        const countriesTemp = data.filter(country => {
          return country.name.common.toLowerCase().includes(newCountry.toLowerCase())
        })
        setCountries(countriesTemp)
      })
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [newCountry])


  const handleCountryChange = (event) => {
    const searchValue = event.target.value
    setNewCountry(searchValue)
    console.log(searchValue)
  }

  return ( 
    <div>
      <h1>Countries</h1>
      <p>find countries</p>
      <input type="text" value={newCountry} onChange={handleCountryChange}/>
      <Countries countries={countries} handleCountryChange={handleCountryChange}/>
    </div>
  )
}
export default App
