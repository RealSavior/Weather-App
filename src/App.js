const express = require('express')
const path = require('path')
const hbs = require('hbs')
const geocode = require('./utils/geocode/geocode.js')
const forecast = require('./utils/forecast/forecast.js')

const app = express()

// Define paths for Express config
const publicDirectory = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)



// Setup static directory to serve
app.use(express.static(publicDirectory))


app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Miguel Suriel'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Miguel Suriel'
    })
        
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Page',
        name: 'Miguel Suriel'
    })
})


app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send( {
            error: 'Please provide an address'
        })
    } 
    
    
    geocode(req.query.address, (error, { latitude, longitude, location} = {} ) => {
     if (error) {
         return res.send({ error })
     }

     forecast(latitude, longitude, (error, forecastData) => {
         if (error) {
            return res.send({error})
         }

         res.send({
             forecast: forecastData,
             location,
             address: req.query.address
         })
     })
    })
    
})



app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Miguel Suriel',
        errorMessage: 'Article Not Found'
    })
})

app.get('*', (req, res) => {
        res.render('404', {
            title: '404',
            name: 'Miguel Suriel',
            errorMessage: 'Page Not Found'
        })

})


//to serve the node express and then provide a function 
app.listen(3000, () => {

    console.log('Server is up on port 3000.')
})