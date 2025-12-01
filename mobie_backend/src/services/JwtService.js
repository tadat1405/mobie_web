const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config(); 


const genneralAccessToken = async (payload) => {
    const access_token = jwt.sign({
        ...payload
    },process.env.ACCESS_TOKEN , {expiresIn: '300s'})
    return access_token
}

const genneralRefreshToken = async (payload) => {
    const refresh_token = jwt.sign({
        ...payload
},process.env.REFRESH_TOKEN, {expiresIn: '365d'})
    return refresh_token
}
const refreshTokenJWTService =(token) => {
    return new Promise( (resolve, reject) => {
        try {
           jwt.verify(token, process.env.REFRESH_TOKEN, async (err,user) =>  {
            if(err){
                resolve({
                    status: "ERROR",
                    message: "The authemcation",
                })
            }
            
            const access_token = await genneralAccessToken({
                id : user?.id,
                isAdmin: user?.isAdmin
            })
            resolve( {
                status: "OK",
                message: "The Succes",
                access_token
            })
        })
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    genneralAccessToken, genneralRefreshToken,refreshTokenJWTService
}
