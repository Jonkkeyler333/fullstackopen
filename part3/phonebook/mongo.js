const mongoose = require('mongoose')

const args = process.argv

if (args.lenght < 3 || args > 5){
    console.log('the number of arguments are not correct :c')
    process.exit(1)
}

console.log(args)
const password = args[2]
const url = `mongodb+srv://keyler:${password}@cluster0.9ngusny.mongodb.net/phonebookApp?appName=Cluster0`
mongoose.set('strictQuery',false)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
    name: String,
    number: Number
})

const Person = mongoose.model('Person', personSchema)

if (args.length === 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
}

if (process.argv.length === 5){
    const name = args[3]
    const number = args[4]
    const person = new Person({
        name: name,
        number: number
    })
    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        console.log(result)
        mongoose.connection.close()
    })
}