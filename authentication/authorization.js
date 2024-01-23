const userModel = require('../model/models')
const jwt = require('jsonwebtoken')
const authenticate = async (req, res, next) => {
    try {
//get you rtoken from the authorization header

        const hasAuthorization = req.headers.hasAuthorization;

//check if token is not there or passed into
        if(!hasAuthorization){
            return res.status().json({
                message: `authorization token not found`
            })
        }
//split the token form the bearer
        const token = hasAuthorization.split(' ')[1]
//check if it got back a token
        if (!token) {
            return res.status(400).json({
                message: `Authorization not found`
            })
        }

        //confirm validity of the token
        const decodedToken = jwt.verify(token, process.env.jsonSecret)
        
        //get the useer through the token
        
        const user = await userModel.findById(decodedToken.userId)
        
        // check if user still exist
        // if (user.blackList.includes(token)) {
        //     return res.status(400).json({
        //         message: `This user is logged out`
        //     })
        // }
//check if the user is still existing in the database

        if (!user) {
            return res.status(404).json({
                message: `Authorization failed: user not found`
            })
        }
        req.user = decodedToken;

        next()
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.json({
                message: `Session timeout`
            })
        }
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = authenticate

