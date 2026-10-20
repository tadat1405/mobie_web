import React, { useEffect, useState } from 'react'
import InputForm from '../../components/InputForm/InputForm';
import './SignInPage.scss';
import { Button, Image } from 'antd';
import Logo_login from '../../assets/images/logo_login.png'
import { EyeFilled,EyeInvisibleFilled  } from '@ant-design/icons';
import {  useLocation, useNavigate } from 'react-router-dom';
import * as UserService from '../../services/UserService';
import { useMutationHook } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import{ useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slice/userSlide';

const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nagivate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

   const mutation = useMutationHook(
    (data) =>UserService.loginUser(data)
   )
   const {data, isPending} = mutation

   useEffect(()=>{
    if(data?.status==="OK"){
      if(location?.state){
        nagivate(location?.state)
      }
      else{
        nagivate('/')
      }
      toast.success(data?.message);
      localStorage.setItem('access_token',JSON.stringify(data?.access_token))
      if(data?.access_token){
        const decode = jwtDecode(data?.access_token);
        if(decode?.id){
          handleGetDetailsUser(decode?.id, data?.access_token)
        }
      }
      console.log(data)
    }
    else if(data?.status==="ERR"){
       toast.error(data?.message)
    }
  },[data?.status])         
    
  const handleGetDetailsUser = async (id,token)=>{
    const res = await UserService.getDetailsUser(id,token);
    dispatch(updateUser({...res?.data, access_token: token}))
  }

  const handleNagivateSignUp=()=>{
    nagivate('/sign-up')
  }
  const handleOnChangEmail = (value)=>{
    setEmail(value);
  }
  const handleOnChangPassword = (value)=>{
    setPassword(value);
  }
  const handleSingIn = ()=>{
    mutation.mutate({email,password})
  }
  return (
    <div className='login'>
      <div className='form-login'>
        <div className='left'>
          <h1 style={{textAlign: 'center', fontSize: '40px', color: 'rgb(10, 104, 255)'}}>Xin chào</h1>
          <p style={{ fontSize: '18px'}}>Đăng nhập vào tài khoản</p>
          <InputForm 
            value = {email}
             handleOnChange = {handleOnChangEmail}
          style= {{marginBottom: '10px', height: '40px'}} placeholder ='abc@gmail.com' type='email'/>
          <div style={{position: 'relative'}}>
            <button 
            type='button'
            onClick={() => setIsShowPassword(!isShowPassword)}
            style={{
              zIndex: 10,
              position: 'absolute',
              top: '12px', right: '8px',
              background: '#fff',
              border: 'none',
              cursor: 'pointer'
            }}>
            {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </button>
            <InputForm 
             value = {password}
              handleOnChange = {handleOnChangPassword}
            style= {{marginBottom: '10px', height: '40px'}} placeholder ='password' type = {isShowPassword ? 'text' : 'password'}/>
          </div>
          {data?.status === 'ERR' && <span style={{color: 'red'}}>{data?.message} !</span>}
          <div className='btn'>
            <Loading styleLoading={{with: '100%'}} isPending={isPending}  >
                 <Button  onClick={handleSingIn} className='btn-login'>Đăng nhập</Button>
          </Loading>
          </div>
          <div className='forgot_password'>
              <h4 style={{color: 'rgb(10, 104, 255)'}}>Quên mật khẩu ?</h4>
              <span>Chưa có tài khoản? </span>
              <span onClick={handleNagivateSignUp} style={{color: 'rgb(10, 104, 255)'}}>Tạo tải khoản</span>
          </div>
        </div>
        <div className='right'>
          <Image className='image_login' src={Logo_login} preview = {false} alt='image_logo'/>
          <span style={{fontSize: '20px', font:'caption', color: 'rgb(10, 104, 255)', marginBottom: '10px'}}>Mua sắm điện thoại</span>
          <span style={{fontSize: '14px', font:'caption', color: 'rgb(10, 104, 255)'}}>Siêu ưu đãi mỗi ngày</span>
        </div>
      </div>
    </div>
  )
}

export default SignInPage