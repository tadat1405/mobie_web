import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    orderItems: [],
    orderItemsSelected: [], 
    shippingAddress: {
        
    },
    paymentMethod: '',
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
    user: '',
    isPaid: false,
    paidAt: '',
    isDelivered: false,
    deliveredAt: '',
}


export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrderProduct: (state, action)=>{
        const {orderItem} = action.payload
        const itemOrder = state?.orderItems?.find((item)=>item?.product === orderItem?.product)
        if(itemOrder){
            itemOrder.amount += orderItem?.amount
        }
        else{
            state.orderItems.push(orderItem)
        }
    },
    increaseAmount: (state, action)=>{
        const {idProduct} = action.payload;
        const itemOrder = state?.orderItems?.find((item)=>item?.product == idProduct)
        const itemOrderSelected = state?.orderItemsSelected?.find((item)=>item?.product == idProduct)
        itemOrder.amount++
        if(itemOrderSelected){
            itemOrderSelected.amount++
        } 
    }, 
    decreaseAmount: (state, action)=>{
        const {idProduct} = action.payload;
        const itemOrder = state?.orderItems?.find((item)=>item?.product == idProduct)
        const itemOrderSelected = state?.orderItemsSelected?.find((item)=>item?.product == idProduct)
        itemOrder.amount--
        if(itemOrderSelected){
            itemOrderSelected.amount--
        }
        
    },    
    removeOrderProduct: (state, action)=>{
        const {idProduct} = action.payload
        const itemOrder = state?.orderItems?.filter((item)=>item?.product !== idProduct)
        const itemOrderSelected = state?.orderItemsSelected?.filter((item)=>item?.product !== idProduct)
        state.orderItems = itemOrder 
        if(itemOrderSelected){
            state.orderItemsSelected = itemOrderSelected
        }
    },  
    removeAllOrderProduct: (state, action)=>{
        const {listChecked} = action.payload
        const itemOrder = state?.orderItems?.filter((item)=> !listChecked.includes(item?.product))
        const itemOrderSelected = state?.orderItemsSelected?.filter((item)=> !listChecked.includes(item?.product))
        state.orderItems = itemOrder 
        if(itemOrderSelected){
            state.orderItemsSelected = itemOrderSelected
        } 
    },    
    selectedOrder: (state, action)=>{
        const {listChecked} = action.payload
        const orderSelected =[]
        state.orderItems.forEach((order)=>{
            if(listChecked.includes(order.product)){
                orderSelected.push(order)
            }
        })
        state.orderItemsSelected = orderSelected
    },    
    // resetOrder: (state) =>{
    //     state.orderItems = [],
    //     state.orderItemsSelected = [], 
    //     state.shippingAddress = {},
    //     state.paymentMethod = '',
    //     state.itemsPrice = 0,
    //     state.shippingPrice = 0,
    //     state.taxPrice = 0,
    //     state.totalPrice = 0,
    //     state.user = '',
    //     state.isPaid = false,
    //     state.paidAt = '',
    //     state.isDelivered = false,
    //     state.deliveredAt = ''
    // }
    
  },
})

// Action creators are generated for each case reducer function
export const {addOrderProduct, increaseAmount, decreaseAmount, removeOrderProduct,removeAllOrderProduct,selectedOrder } = orderSlice.actions

export default orderSlice.reducer