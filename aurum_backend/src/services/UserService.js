const User = require("../models/UserModel");
const bcrypt = require('bcrypt');
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");

const createUser =  (newUser)=>{
    return new Promise(async(resolve, reject) => {

         const { email, password, confirmPassword} = newUser;
        try {
            const checkEmail = await User.findOne({
                email: email
            })
            if(checkEmail !== null){
                resolve({
                    status: 'ERR', 
                    message: 'Email already exists',
                
                })
            }
                const hash = bcrypt.hashSync(password, 10);
                const createUser = await User.create({
                email,
                password: hash,
            }
            )
            if(createUser){
                resolve({
                    status: 'OK', 
                    message: ' Create user success',
                    data: createUser
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
const loginUser =  (login)=>{
    return new Promise(async(resolve, reject) => {

         const { email, password} = login;
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if(checkUser === null){
                resolve({
                    status: 'ERR', 
                    message: 'Email is not define', 
                
                })
            }

            const comparePassword = bcrypt.compareSync(password, checkUser.password);
            if(!comparePassword){
                resolve({
                    status: 'ERR', 
                    message: 'The password or user incorrect', 
                })
            }
            const access_token = await genneralAccessToken({
                id: checkUser._id,
                isAdmin : checkUser.isAdmin
            })
            const refesh_token = await genneralRefreshToken({
                id: checkUser._id,
                isAdmin : checkUser.isAdmin
            })
            resolve({
                status: 'OK', 
                message: 'Login succes',
                access_token,
                refesh_token
             })
        } catch (error) {
            reject(error)
        }
    })
}
const updateUser = (id, data)=>{
    return new Promise(async(resolve, reject) => {
        try {
            const checkUser = await User.findOne(
                {
                    _id: id
                }
            );
            if(checkUser === null){
                resolve({
                    status: 'ERR', 
                    message: 'The user is not define',
                })
            }
            
            
            const updateUser = await User.findByIdAndUpdate(id,data, {new: true});
            resolve({
                status: 'OK', 
                message: 'Update succes',
                data: updateUser,
             })
        } catch (error) {
            reject(error)
        }
    })
}
const deleteUser = (id)=>{
    return new Promise(async(resolve, reject) => {
        try {
            const checkUser = await User.findOne(
                {
                    _id: id
                }
            );
            if(checkUser === null){
                resolve({
                    status: 'OK', 
                    message: 'The user is not define',
                })
            }
            
            const deletedUser = await User.findByIdAndDelete(id);
            resolve({
                status: 'OK', 
                message: 'Delete succes',
                data: deletedUser,
             })
        } catch (error) {
            reject(error)
        }
    })
}
const deleteManyUser = (ids)=>{
    return new Promise(async(resolve, reject) => {
        try {
            const deletedUser = await User.deleteMany({_id: ids});
            resolve({
                status: 'OK', 
                message: 'Delete succes',
                data: deletedUser,
             })
        } catch (error) {
            reject(error)
        }
    })
}


const getAllUser = async() =>{
        try {
            const allUser = await User.find();
            return {
                status: 'OK', 
                message: 'Get all user success',
                data: allUser,
             }
        } catch (error) {
            return error
        }
    
}

const getDatails = async (id)=>{
        try {
            const getDetails = await User.findOne(
                {
                    _id: id
                }
            );
            if(getDetails === null){
                return {
                    status: 'ERR', 
                    message: 'The user is not define',
                }
            }
            return ({
                status: 'OK', 
                message: 'GetDetail Succes',
                data: getDetails,
             })
        } catch (error) {
            return error
        }
}
module.exports  = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDatails,
    deleteManyUser
}