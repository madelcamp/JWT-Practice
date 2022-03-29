const User = require('../models/User')
const jwt = require('jsonwebtoken')

// Handle errors
const handleErrors = err => {
    console.log(err.message, err.code);
    let errors = {email: '', password: ''}

    // Incorrect email

    if (err.message === 'Incorrect email' ) {
        errors.email = 'That email is not registered'
    }

    if (err.message === 'Incorrect password' ) {
        errors.password = 'That password is incorrect'
    }

    // Duplicate error code
    if (err.code === 11000) {
        errors.email = 'That email is already registered'
        return errors
    }

    // Validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        })
    }

    return errors
}
const maxAge = 3 * 24 * 60 * 60 // in seconds
const createToken = id => {
    return jwt.sign({ id }, 'mario super secret', { expiresIn: maxAge })  // (payload, secret, options)
}

const signup_get = (req, res) => {
    res.render('signup')
}

const login_get = (req, res) => {
    res.render('login')
}

const signup_post = async (req, res) => {
    try {

        const { email, password } = req.body     
        const user = await User.create({ email, password })
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 }) // in seconds

        res.status(201).json({ user: user._id })

    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

const login_post = async (req, res) => {
    try {

        const { email, password } = req.body

        const user = await User.login(email, password)
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({ user: user._id })

    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

const logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 0 })
    res.redirect('/')
}

module.exports = {
    signup_get,
    login_get,
    signup_post,
    login_post,
    logout_get
}