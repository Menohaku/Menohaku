
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 1337


const dbUrl = 'mongodb://localhost:27017/menohaku'

const Click = mongoose.model('Click', {
    id: String,
    time: String,
    age: Number,
    gender: String,
    uuid: String,
    keywords: [String]
})

// configuration ===============================================================
mongoose.connect(dbUrl, (error) => {
    if (error) {
        console.log(error)
    } else {
        console.log(`Mongoose connected to ${dbUrl}`)
    }
}) // connect to our database


// set up our express application

app.use(cookieParser()) // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ extended: true })) // get information from html forms
app.use(bodyParser.json())

// routes ======================================================================


app.post('/click', (req, res) => {
    console.log(req.body)
    const { id, time, age, gender, uuid, keywords } = req.body
    const click = new Click({ id, time, age, gender, uuid, keywords })
    click.save().then(() => {
        console.log('saved')
    })
    res.sendStatus(200)
})

app.get('/recommend', (req, res) => {
    res.sendStatus(501) // Not implemented
})

// launch ======================================================================
app.listen(port)
console.log(`The magic happens on port ${port}`)
