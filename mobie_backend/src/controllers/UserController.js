const UserService = require('../services/UserService');
const JwtService = require('../services/JwtService');

// sign-up
const createUser = async(req,res)=>{
    try {
        console.log(req.body);
        const { email, password, confirmPassword} = req.body;
        const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const isCheckEmail = reg.test(email);
        if( !email || !password || !confirmPassword ){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required',
            })
        
        }
        else if(!isCheckEmail){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is email',
            })
        }
        else if (password !== confirmPassword){
            return res.status(200).json({
                status: "ERR",
                message: 'The password is equal confirmPassword'
            })
        }
        
        const response = await UserService.createUser(req.body)
        return res.status(200).json(response);


    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

//sign-in
const loginUser = async(req,res)=>{
    try {
        const { email, password} = req.body;
        const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const isCheckEmail = reg.test(email);
        if( !email || !password  ){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required',
            })
        
        }
        else if(!isCheckEmail){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is email',
            })
        }

        const response = await UserService.loginUser(req.body)
        const {refesh_token, ...newRespone} = response;
        res.cookie('refesh_token',refesh_token,{
            httpOnly: true,
            secure: false,
            samesite: 'strict'
        })
        return res.status(200).json(newRespone);
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

// update
const updateUser = async(req,res)=>{
    try {
        const userId = req.params.id;
        const data =  req.body;
        if(!userId){
            return res.status(200).json({
                status: "ERR",
                message: "The userId is requied"
            })
        }
        const response = await UserService.updateUser(userId,data)
        return res.status(200).json(response);


    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

//delete
const deleteUser = async (req,res) => {
        try {
            const userId = req.params.id;
            const token = req.headers;
            console.log("token", token);
            if(!userId){
            return res.status(200).json({
                status: "ERR",
                message: "The userId is requied"
            })
        }
         const response = await UserService.deleteUser(userId);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(200).json({
                message: error
            })
        }
};
const deleteMany = async (req,res) => {
        try {
            const ids = req.body.ids;
            if(!ids){
            return res.status(200).json({
                status: "ERR",
                message: "The ids is requied"
            })
        }
         const response = await UserService.deleteManyUser(ids);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(200).json({
                message: error
            })
        }
};
const getAllUser = async (req,res) => {
        try {
            const response = await UserService.getAllUser();
            return res.status(200).json(response); 
        } catch (error) {
            return res.status(200).json({
                message: error
            })
        }
};

const getDatails = async (req,res) => {
        try {
            const userId = req.params.id;
            if(!userId){
            return res.status(200).json({
                status: "ERR",
                message: "The userId is requied"
            })
        }
         const response = await UserService.getDatails(userId);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(200).json({
                message: error
            })
        }
};
const refreshToken = async (req,res) => {
        try {
            const token = req.cookies.refesh_token;
            if(!token){
            return res.status(200).json({
                status: "ERR",
                message: "The token is required"
            })
        }
         const response = await JwtService.refreshTokenJWTService(token);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(404).json({
                message: error
            })
        }
};
const logOutUser = async (req,res)=>{
    try {
        res.clearCookie('refesh_token');
         return res.status(200).json({
                status: "OK",
                message: 'Logout successfully'
            })
    } catch (error) {
        return res.status(404).json({
                message: error
            })
    }
}
module.exports  = {
    createUser,
    loginUser, 
    updateUser,
    deleteUser,
    getAllUser,
    getDatails,
    refreshToken,
    logOutUser,
    deleteMany
}