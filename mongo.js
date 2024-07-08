const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const addPerson = process.argv[3]
const addNumber = process.argv[4]

const url =
`mongodb+srv://nart:${password}@cluster0.bwr4wbt.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=Cluster0`


mongoose.set('strictQuery',false)

mongoose.connect(url)

const personsSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personsSchema)

if (!addPerson || !addNumber) {
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })
}else {
const person = new Person({
    name: addPerson,
    number: addNumber,
})

person.save().then(result => {
  console.log(`added ${addPerson} number ${addNumber} to phonebook`)
  mongoose.connection.close()
})
}