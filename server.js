require('dotenv').config()
const express = require("express")
const server = express()

const jwt = require("jsonwebtoken")

server.use(express.json())

const posts = [
    {
        username: 'Kyle',
        title: 'Post1'
    },
    {
        username: 'John',
        title: 'Post2'
    }
]
server.get('/posts',authenticateToken,(req, res)=>{
    res.send(posts.filter(post => post.username ===req.user.name))
})

server.post('/login', (req, res)=>{

    const username = req.body.username
    const user ={name: username}
    const accessToken = jwt.sign(user, process.env.SECRET_KEY)
    res.json({accessToken:accessToken})
})

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token ==null)return res.sendStatus(401)

    jwt.verify(token, process.env.SECRET_KEY, (err, user) =>{
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

server.listen(3000)