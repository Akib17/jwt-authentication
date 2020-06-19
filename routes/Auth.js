const router = require('express').Router()
const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { registrationValidate, loginValidation } = require('../Validation')

router.post('/registration', async (req, res) => {

    const { error } = registrationValidate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const existUser = await User.findOne({ email: req.body.email })
    if (existUser) return res.status(400).send('Email already exists')

    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPass
    })
    try {
        const savedUser = await user.save()
        res.send(savedUser)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    // Check if exist user
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.send(`${req.body.email} is not exists`)
    
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send('Password not valid')
    
    // Create & assign a token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN)
    res.header('auth-token', token).send(token)
})

module.exports = router