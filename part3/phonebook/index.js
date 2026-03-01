require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    if (error.name === 'CastError'){
        return response.status(404).send({ error: 'malformatted id' })
    }else if (error.name === 'ValidationError'){
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => res.json(persons))
})

app.get('/api/persons/:id', (req, res, next) =>{
    const id = req.params.id
    Person.findById(id)
    .then(person => {
        if (person){
            res.json(person)
        }else{
            res.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findByIdAndDelete(id).then(() => {
        res.status(204).end()
    }).catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body
    if (!body){
        return res.status(400).json({'error':'missing data'})
    }else if (!body.name || !body.number){
        return res.status(400).json({'error':'missing name or number'})
    }else{
        const person = new Person({
            name: body.name,
            number: body.number,
        })
        person.save()
        .then(savedPerson => {
            res.status(201).json(savedPerson)
        })
        .catch(error => next(error))
    }
})

app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    const body = req.body
    if (!body){
        return res.status(400).json({'error':'missing data'})
    }else if (!body.name || !body.number){
        return res.status(400).json({'error':'missing name or number'})
    }else{
        const person = {
            name: body.name,
            number: body.number,
        }
        Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
    }
})

app.get('/info', (req, res) => {
    Person.countDocuments({}).then(total_contacts => {
        res.send(`<p>Phonebook has info for ${total_contacts} people</p>
        <p>${Date()}</p>`)
    })
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})