const Order = require("../models/OrderProduct");
const Product = require("../models/ProductModel");

const createOrder = async (newOder) => {
    const {orderItems,paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, isPaid, paidAt} = newOder;
    try {
       const promises =  orderItems?.map( async (order) => {
            const productData = await Product.findOneAndUpdate({
            _id: order.product,
            countInStock: {$gte: order.amount}
            },
            {$inc: {
                countInStock: -order.amount,
                selled: +order.amount
            }},
            {new: true}
        )
        console.log('prodcutdata', productData)
        if(productData){
            const createOrder = await Order.create({
                orderItems,
                shippingAddress: {
                    fullName,
                    address,city,
                    phone
                },
                paymentMethod,
                itemsPrice,
                shippingPrice,
                totalPrice,
                user: user,
                isPaid, 
                paidAt
                
            })
            if(createOrder){
                return {
                    status: 'OK', 
                    message: 'Create order success',
                }
            }
        }else{
            return {
                    status: 'OK', 
                    message: 'ERR',
                    id: order?.product
                }
        }
        })
        const result = await Promise.all(promises)
        const newData =result && result.filter((item)=>item.id)
        if(newData.length){
            return ({
                status: 'ERR', 
                message: `Sản phẩm với id ${newData.join(',')} không đủ hàng`,
                id: order?.product
            })
        }
        return (
            {
                status: 'OK', 
                message: 'Success',
            }
        )
    } catch (error) {
        return error
    }
}
const getAllOrderDetails = async (id) => {
    console.log("id", id)
    try {
        const order = await Order.find({
            user: id
        });
        if(order === null){
            return ({
                status: "ERR",
                message: "The order is not define"
            })
        }
        return ({
            status: 'OK', 
            message: 'Get order succes',
            data: order,
        })
    } catch (error) {
        return error
    }
}
const getDetailsOrder = async (id) => {
    try {
        const order = await Order.findById({
            _id: id
        });
        if(order === null){
            return ({
                status: "ERR",
                message: "The order is not define"
            })
        }
        return ({
            status: 'OK', 
            message: 'Get order succes',
            data: order,
        })
    } catch (error) {
        return error
    }
}

const cancelOrderDetails = async (id,data) => {
    try {
       const order =  await Order.findByIdAndDelete(id);
       if(order === null){
        return ({
            status: 'ERR', 
            message: 'The order is not defined',
        })
       }
        return ({
            status: 'OK', 
            message: 'Delete Success',
            data: order,
        })
    } catch (error) {
        return error
    }
}

const getAllOrder = async() =>{
        try {
            const allOrder = await Order.find();
            return {
                status: 'OK', 
                message: 'Get all order success',
                data: allOrder,
             }
        } catch (error) {
            return error
        }
    
}
module.exports = {
    createOrder,
    getAllOrderDetails,
    getDetailsOrder,
    cancelOrderDetails,
    getAllOrder
}