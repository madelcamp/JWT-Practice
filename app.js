const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')
const { requireAuth, checkUser } = require('./middlewares/authMiddleware')

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json()) // parses json to js objects, used as req.body
app.use(cookieParser()) // so that we can use req.cookiess

// view engine
app.set('view engine', 'ejs');

// routes
app.get('*', checkUser) // Applying a middleware to every get route
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes)

// database connection
const initializer = async () => {
  try {

    const dbURI = 'my-db-URI'
    const options = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
    const result = await mongoose.connect(dbURI, options)
    //console.log(result);

    app.listen(3000)
    console.log('Listening')

  } catch (error) {
    console.log(error)
  }
}

initializer()


// // Cookies
// app.get('/set-cookies', (req, res) => {

//   //res.setHeader('Set-Cookie', 'newUser=true')
//   res.cookie('newUser', false)
//   res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 24 }) 
//           // httpOnly: true  #no acces on javascript
//           // secure: true #it doesn't send the cookie if there is no https conection
//           // in browser, to acces the cookie in the console: document.cookie

//   res.send('You got the cookies!')

// })

// app.get('/read-cookies', (req, res) => {

//   const cookies = req.cookies
//   console.log(cookies.newUser)

//   res.json(cookies)  // Sending back some json, maybe for front-end consuming

// })
