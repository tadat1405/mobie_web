import axios from "axios"

export const axiosJWT = axios.create()


export const loginUser = async (data)=>{
    const res = await axios.post(`${import.meta.env.VITE_API_URL_BACKEND}/user/sign-in`,data);
    return res.data
}
export const signUpUser = async (data)=>{
    const res = await axios.post(`${import.meta.env.VITE_API_URL_BACKEND}/user/sign-up`,data);
    return res.data
}
export const getDetailsUser = async (id,access_token)=>{
    const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL_BACKEND}/user/get_details/${id}`,{
        headers:{
            token: `Bearer ${access_token}`,
        }
    });
    return res.data
}
export const deleteUser = async (id,access_token)=>{
    const res = await axiosJWT.delete(`${import.meta.env.VITE_API_URL_BACKEND}/user/delete-user/${id}`,{
        headers:{
            token: `Bearer ${access_token}`,
        }
    });
    return res.data
}
export const getAllUser = async (id,access_token)=>{
    const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL_BACKEND}/user/get_all_user`,{
        headers:{
            token: `Bearer ${access_token}`,
        }
    });
    return res.data
}
export const refreshToken = async ()=>{
    const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/user/refresh_token`,{
        withCredentials: true,
    });
    return res.data
}
export const logoutUser = async ()=>{
    const res = await axios.post(`${import.meta.env.VITE_API_URL_BACKEND}/user/log-out`)
    return res.data
}
export const updateUser = async (id, data, access_token)=>{
    const res = await axiosJWT.put(`${import.meta.env.VITE_API_URL_BACKEND}/user/update-user/${id}`,data,{
        headers:{
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}
export const deleteManyUser = async (data, access_token)=>{
    const res = await axiosJWT.post(`${import.meta.env.VITE_API_URL_BACKEND}/user/delete-many`, data,{
        headers:{
            token: `Bearer ${access_token}`,
        }
    });
    return res.data
}