const Persons = ({ personsToShow, handleDelete }) => {
    const deletePerson = (person) => {
        if (window.confirm(`Delete ${person.name}?`)){
            handleDelete(person.id)
        }
    }
    return (
        <div>
            {personsToShow.map(person => 
                <div key={person.id}>
                <p>{person.name} {person.number}</p>
                <button onClick={() => deletePerson(person)}>delete</button>
                </div>
            )}
        </div>
    )
}

export default Persons