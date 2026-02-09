import Country from "./Country"
import Details from "./Details"

const Countries = ({countries,handleCountryChange}) => {
    if (countries.length > 10) {
        return <p>Too many matches, specify another filter</p>
    }else if (countries.length === 1) {
        return <Details country={countries[0]}/>
    }else if (countries.length === 0){
        return <p>Upsy , any for u</p>
    }else{
        return countries.map(country => <Country key={country.name.common} country={country} handleCountryChange={handleCountryChange}/>)
    }
}

export default Countries