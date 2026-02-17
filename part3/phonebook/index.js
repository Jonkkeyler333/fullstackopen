const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let contacts = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(contacts)
})

app.get('/api/persons/:id', (req, res) =>{
    const id = req.params.id
    const person = contacts.find(contact => contact.id == id)
    if (person){
        res.json(person)
    }else{
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    contacts = contacts.filter(contact => contact.id != id)
    res.json(contacts)
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body){
        return res.status(400).json({'error':'missing data'})
    }else if (!body.name || !body.number){
        return res.status(400).json({'error':'missing name or number'})
    }else if (contacts.find(contact => contact.name.toLowerCase() === body.name.toLowerCase())){
        return res.status(400).json({'error':'name must be unique'})
    }else{
        const person = {
            id: String(Math.floor(Math.random()*100000)),
            name: body.name,
            number: body.number,
        }
        contacts = contacts.concat(person)
        res.json(person)
    }
})

app.get('/info', (req, res) => {
    const total_contacts = contacts.length
    res.send(`<p>Phonebook has info for ${total_contacts} people</p>
    <p>${Date()}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})