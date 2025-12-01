import React, { Fragment, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import HeaderComponent from './components/HeaderComponent/HeaderComponent';
import DefaultComponent from './components/DefaultComponent/DefaultComponent';
 import { ToastContainer } from 'react-toastify';
import { isJsonString } from '../utils';
import * as UserService from '../src/services/UserService';
import { jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from './redux/slice/userSlide';
import Loading from './components/LoadingComponent/Loading';

 const App = ()=> {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector((state) => state.user)

  
  useEffect(()=>{
    setIsLoading(true)
      const  {storageData,decoded} = handleDecoded();
          if(decoded?.id){
             handleGetDetailsUser(decoded?.id, storageData)}
    setIsLoading(false)
    },[])

const handleDecoded = ()=>{
    let storageData = localStorage.getItem('access_token');
    let decoded = {}
      if(storageData && isJsonString(storageData)){
        storageData = JSON.parse(storageData)
          decoded = jwtDecode(storageData);
      }
      return {decoded,storageData}
}

    UserService.axiosJWT.interceptors.request.use(async (config) =>{
      const currentTime = new Date()
      const  {decoded} = handleDecoded();
     if(decoded?.exp < currentTime.getTime()/1000){
      const data = await UserService.refreshToken()
      config.headers['token'] = `Bearer ${data?.access_token}`
     }
    return config;
  },(error)=> {
    return Promise.reject(error);
  });

  const handleGetDetailsUser = async (id,token)=>{
      const res = await UserService.getDetailsUser(id,token);
      dispatch(updateUser({...res?.data, access_token: token}))
    }
  
  return (
    <div>
      <Loading isPending={isLoading}>
        <Router>
        <Routes>
          {
            routes.map((route,index)=>{
              const Page = route.page
              const isCheckAuth = !route.isPrivate || user.isAdmin
              const Layout = route.isShowHeader ? DefaultComponent : Fragment
              return (
                <Route key={index} path={isCheckAuth ? route.path : null} element={
                  <Layout>
                    <Page/>
                  </Layout>
                } />
              )
            })
          }
        </Routes>
         <ToastContainer />
      </Router>
      </Loading>
    </div>
  )
}

export default App