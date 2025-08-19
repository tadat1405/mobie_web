const Product = require("../models/ProductModel");

const createProduct = async (product) => {
    const {name, image, type, price, countInStock, rating,discount, description} = product;
    try {
        const checkName = await Product.findOne({name: name})
        if(checkName !== null){
                return ({
                    status: 'OK', 
                    message: 'Name already exists'
                })
            }
        const createProduct = await Product.create({
            name: name,
            image: image,
            type: type,
            price: price,
            countInStock: countInStock,
            rating: rating,
            discount: discount,
            description: description
        })
        if(createProduct){
            return ({
                status: 'OK', 
                message: 'Create product success',
                data: createProduct
            })
        }
    
    } catch (error) {
        
    }
}
const updateProduct = async (id,data) => {
    try {
        const checkUser = await Product.findOne({
            _id: id
        });
        if(checkUser === null){
            return ({
                status: "ERR",
                message: "The user is not define"
            })
        }
        const updateProduct = await Product.findByIdAndUpdate (id, data, {new: true});
        return ({
            status: 'OK', 
            message: 'Update succes',
            data: updateProduct,
        })
    } catch (error) {
        return error
    }
}
const getDetailsProduct = async (id) => {
    try {
        const getDtailesProduct = await Product.findOne({
            _id: id
        });
        if(getDtailesProduct === null){
            return ({
                status: "ERR",
                message: "The user is not define"
            })
        }
        return ({
            status: 'OK', 
            message: 'Get details succes',
            data: getDtailesProduct,
        })
    } catch (error) {
        return error
    }
}
const deleteProduct = async (id) => {
    try {
        const getDtailesProduct = await Product.findOne({
            _id: id
        });
        if(getDtailesProduct === null){
            return ({
                status: "ERR",
                message: "The user is not define"
            })
        }
       const deletedProduct =  await Product.findByIdAndDelete(id);
        return ({
            status: 'OK', 
            message: 'Delete Success',
            data: deletedProduct,
        })
    } catch (error) {
        return error
    }
}
const deleteManyProduct = async (ids) => {
    try {
        // const getDtailesProduct = await Product.findOne({
        //     _id: id
        // });
        // if(getDtailesProduct === null){
        //     return ({
        //         status: "ERR",
        //         message: "The user is not define"
        //     })
        // }
       const deletedProduct =  await Product.deleteMany({_id: ids});
        return ({
            status: 'OK', 
            message: 'Delete Success',
            data: deletedProduct,
        })
    } catch (error) {
        return error
    }
}
const getAllProduct = async (limit , page ,sort ,filter ) => {
    try {
        const totalProduct = await Product.countDocuments();
        let allProduct = [];
        if(filter){
            const lable = filter[0];
             const allProductFilter =  await Product.find({ [lable]: {'$regex':filter[1]}}).limit(limit).skip(limit * page);
             return ({
            status: 'OK', 
            message: 'Get all product succes',
            data: allProductFilter,
            total: totalProduct,
            pageCurrtent: Number(page + 1),
            totalPages: Math.ceil(totalProduct/limit),

                        
        })
        }
        if(sort){
            const objectSort = {};
            objectSort[sort[1]] = sort[0];
             const allProductSort =  await Product.find().limit(limit).skip(limit * page).sort(objectSort);
             return ({
            status: 'OK', 
            message: 'Get all product succes',
            data: allProductSort,
            total: totalProduct,
            pageCurrtent: Number(page + 1),
            totalPages: Math.ceil(totalProduct/limit),

                        
        })
        }
         if(!limit){
            allProduct =  await Product.find()
            }
            else{
                allProduct =  await Product.find().limit(limit).skip(limit * page).sort({name: 'asc'});
            }
        return ({
            status: 'OK', 
            message: 'Get all product succes',
            data: allProduct,
            total: totalProduct,
            pageCurrtent: Number(page + 1),
            totalPages: Math.ceil(totalProduct/limit),

                        
        })
    } catch (error) {
        return error
    }
}
const getAllType = async ( ) => {
    try {
       const allType =  await Product.distinct('type')
        return ({
            status: 'OK', 
            message: 'Get all product succes',
            data: allType,            
        })
    } catch (error) {
        return error
    }
}
module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteManyProduct,
    getAllType
}