const router = require('express').Router()
const verify = require('../verify')

router.get('/', verify, (req, res) => {
    res.json({
        posts: {
            title: 'Hello world',
            description: 'Random post description'
        }
    })
})

module.exports = router