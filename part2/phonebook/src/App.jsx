import { useState, useEffect } from 'react'
import Filter from './components/Filter.jsx'
import PersonForm from './components/PersonForm.jsx'
import Persons from './components/Persons.jsx'
import Notification from './components/Notification.jsx'
import namesService from './services/names.js'  

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(()=>{
    namesService
    .getAll()
    .then(initialNames => {
      console.log('promise fulfilled')
      setPersons(initialNames)
    })
  },
  [])
  console.log('render',persons.length,'persons')

  const addName = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name.toLowerCase() === newName.toLowerCase())) {
      if (window.confirm(`${newName} is alredy added to phonebook, replace the old number with a new one?`)){
        const person = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())
        const changedPerson = { ...person, number: newNumber }
        namesService
        .updateEntry(person.id, changedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
          setSuccessMessage(`updated ${newName.name} number`)
          setNewName('')
          setNewNumber('')
          setTimeout(() => setSuccessMessage(null),5000)
        })
      }
    }
    else {
      namesService
      .addEntry({ name: newName, number: newNumber })
      .then(newName => {
        console.log('promise fulfilled')
        setPersons(persons.concat(newName))
        setSuccessMessage(`Added ${newName.name}`)
        setNewName('')
        setNewNumber('')
        setTimeout(() => setSuccessMessage(null),5000)
      })
    }
  }

  const deleteName = (id) => {
    namesService
    .deleteEntry(id)
    .then(deletedName => {
      console.log('promise fulfilled',deletedName)
      setPersons(persons.filter(person => person.id !== id))
    }
    ).catch(error => {
      setPersons(persons.filter(person => person.id !== id))
      setSuccessMessage(`Information of ${persons.find(p => p.id === id).name} has already been removed from server`)
      setTimeout(() => setSuccessMessage(null),5000)
    })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
    console.log(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
    console.log(event.target.value)
  }

  const handleFilter = (event) => {
    setFilterName(event.target.value)
  }

  const personsToShow = filterName === '' ? persons : 
  persons.filter(person => 
    person.name.toLowerCase().includes(filterName.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage}/>
      <Filter filterName={filterName} handleFilter={handleFilter} />
      <h2>Add a new</h2>
      <PersonForm addName={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} handleDelete={deleteName} />
    </div>
  )
}

export default App