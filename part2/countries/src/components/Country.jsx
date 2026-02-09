const Country = ({ country, handleCountryChange}) => {
    return (
        <div>
            <p>{country.name.common}</p>
            <button value={country.name.common} onClick={handleCountryChange}>show</button>
        </div>
    )
}

export default Country