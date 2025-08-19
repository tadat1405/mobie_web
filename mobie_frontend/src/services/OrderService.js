import { axiosJWT } from "./UserService";

export const createOrder = async ( id,data,access_token)=>{
    const res = await axiosJWT.post(`${import.meta.env.VITE_API_URL_BACKEND}/order/create/${id}`,data,{
        headers:{
            token: `Bearer ${access_token}`,
        }
    });
    return res.data
}
export const getOrderbyUserId = async ( id, access_token)=>{
    const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL_BACKEND}/order/get-all-order/${id}`,{
        headers:{
            token: `Bearer ${access_token}`,
        }
    });
    return res.data
}
export const getDetailsOrder = async ( id, access_token)=>{
    const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL_BACKEND}/order/get-details-order/${id}`,{
        headers:{
            token: `Bearer ${access_token}`,
        }
    });
    return res.data
}
export const cancelOrder = async ( id, access_token)=>{
    const res = await axiosJWT.delete(`${import.meta.env.VITE_API_URL_BACKEND}/order/cancel-order/${id}`,{
        headers:{
            token: `Bearer ${access_token}`,
        }
    });
    return res.data
}
export const getAllOrder = async ( id, access_token)=>{
    const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL_BACKEND}/order/get-all-order`,{
        headers:{
            token: `Bearer ${access_token}`,
        }
    });
    return res.data
}


