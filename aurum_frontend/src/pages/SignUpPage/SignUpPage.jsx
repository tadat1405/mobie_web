import React, { useEffect, useState } from 'react'
import InputForm from '../../components/InputForm/InputForm';
import './SignUpPage.scss';
import { Button, Image } from 'antd';
import Logo_login from '../../assets/images/logo_login.png';
import { EyeFilled,EyeInvisibleFilled  } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMutationHook } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService';
import Loading from '../../components/LoadingComponent/Loading';
import { toast } from 'react-toastify';

const SignUpPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowComfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const nagivate = useNavigate();

   const mutation = useMutationHook(
      (data) =>UserService.signUpUser(data)
     )
     console.log(mutation)
     const {data, isPending,isError,isSuccess} = mutation

     useEffect(()=>{
       if(isSuccess){
        toast.success(data?.message)
        handleNagivateSignIn();
      }
      else if(!isError){
        toast.error(data?.message)
      }

     },[isError,isSuccess])

  const handleNagivateSignIn=()=>{
    nagivate('/sign-in')
  }

  const handleOnChangEmail = (value)=>{
    setEmail(value);
  }
  const handleOnChangPassword = (value)=>{
    setPassword(value);
  }
  const handleOnChangConfirmPassword = (value)=>{
    setConfirmPassword(value);
  }
  const handleSignUp = () => {
  // if (!email || !password || !confirmPassword) {
  //   alert("Vui lòng điền đầy đủ thông tin!");
  //   return;
  // }

  // if (password !== confirmPassword) {
  //   alert("Mật khẩu xác nhận không khớp!");
  //   return;
  // }

  mutation.mutate({email, password, confirmPassword})
};
  return (
    <div className='login'>
      <div className='form-login'>
        <div className='left'>
          <h1 style={{textAlign: 'center', fontSize: '40px', color: 'rgb(10, 104, 255)', marginBottom: '0px'}}>Xin chào</h1>
          <p style={{ fontSize: '18px'}}>Đăng ký tài khoản</p>
          <InputForm 
          value = {email}
          handleOnChange = {handleOnChangEmail}
          style= {{marginBottom: '10px', height: '40px'}} placeholder ='abc@gmail.com'/>
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
          <div style={{position: 'relative'}}>
            <button 
            type='button'
            onClick={() => setIsShowComfirmPassword(!isShowConfirmPassword)}
            style={{
              zIndex: 10,
              position: 'absolute',
              top: '12px', right: '8px',
              background: '#fff',
              border: 'none',
              cursor: 'pointer'
            }}>
            {isShowConfirmPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </button>
            <InputForm 
            value= {confirmPassword}
             handleOnChange = {handleOnChangConfirmPassword}
            style= {{marginBottom: '10px', height: '40px'}} placeholder ='password' type = {isShowConfirmPassword ? 'text' : 'password'}/>
          </div>
          {data?.status === 'ERR' && <span style={{color: 'red'}}>{data?.message}</span>}
          <div className='btn'>
              <Loading styleLoading={{with: '100%'}} isPending={isPending}  >
                 <Button onClick={handleSignUp} className='btn-login'>Đăng ký</Button>
              </Loading>
          </div>
          <div className='forgot_password'>
              <span>Bạn đã có tài khoản? </span>
              <span onClick={handleNagivateSignIn} style={{color: 'rgb(10, 104, 255)'}}>Đăng nhập</span>
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

export default SignUpPage