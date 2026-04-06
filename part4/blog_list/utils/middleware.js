const User = require('../models/user')
const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
   const authorization = request.get('Authorization')
   request.token = null
   if (authorization && authorization.startsWith('Bearer ')){
       request.token =  authorization.replace('Bearer ','')
   }
   next()
}

const userExtractor = async (request, response, next) => {
    const token = request.token
    if (!token){
        return response.status(401).json({error: 'Invalid credentials'})
    }
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id){
        return response.status(401).json({error: 'invalid token'})
    }
    const user = await User.findById(decodedToken.id)
    if (!user){
        return response.status(401).json({error: 'invalid credentials'})
    }
    request.user = user 
    next()
}

module.exports =  {tokenExtractor, userExtractor}