import React, { useEffect, useState } from 'react'
import { Badge, Button, Col, Popover, Row } from 'antd';
import { WrapperHeader, WrapperHeaderAccount, WrapperTextHeader, WrapperTextHeaderSmall } from './style';
import Search from 'antd/es/transfer/search';
import { CaretDownFilled, CaretDownOutlined, ShoppingCartOutlined, StarFilled, UserOutlined } from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService';
import { resetUser} from '../../redux/slice/userSlide';

import './HeaderComponent.scss'
import Loading from '../LoadingComponent/Loading';
import { searchProduct } from '../../redux/slice/productSlice';

const HeaderComponent = ({isHiddenSearch = false,isHiddentCard= false}) => {
  const dispatch = useDispatch();
  const nagivate = useNavigate();
  const user = useSelector((state)=>state.user)
  const [userName, setUserName] = useState('')
  const [avatar, setAvatar] = useState('');
  const order = useSelector((state)=>state.order)
  const [loading, setLoading] = useState(false);
  const handleNavigateLogin = ()=>{
    nagivate('/sign-in')
  }
  const handleLogout = async ()=>{
    setLoading(true)
    await UserService.logoutUser();
    dispatch(resetUser());
    

    setLoading(false)
    nagivate('/')
  }
  useEffect(()=>{
    setLoading(true)
    setUserName(user?.name)
    setAvatar(user?.avatar)
    setLoading(false)
    
  },[user])
  const content =(
    <div>
      <p onClick={()=>{nagivate('/profile-user')}} className='pop infor'>Thông tin người dùng</p>
      {user?.isAdmin ? (<p onClick={()=>{nagivate('/system/admin')}} className='pop admin'>Quản lý hệ thống</p>):''}
      <p onClick={()=>{nagivate('/my-order',{state:{id: user?.id, token: user?.access_token}})}} className='pop logout'>Đơn hàng của tôi</p>
      <p onClick={handleLogout} className='pop logout'>Đăng xuất</p>
    </div>
  )
  const onSearch = (e)=>{
    dispatch(searchProduct(e.target.value))
  }
  return (
    <div>
      <WrapperHeader>
      
        <Col span={6}>
        <WrapperTextHeader style={{cursor: 'pointer'}} onClick={()=>{nagivate('/')}}>MOBIE WEB</WrapperTextHeader>
        </Col>
        {!isHiddenSearch ? <Col span={12}>
          <ButtonInputSearch 
            placeholder="input search text" 
            size = "larger" 
            textButton = "Tìm kiếm"
            onChange={onSearch}
           />
        </Col>: <Col span={12} style={{
          fontSize: '25px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}><StarFilled /><span style={{margin: '0 15px'}}>Quản Trị Viên</span><StarFilled /></Col>}
        <Col span={6}>
          <Loading styleLoading={{with: '100%'}} isPending={loading}  >
                <WrapperHeaderAccount>
                  {avatar?.length ? (<img style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }} src={avatar}/>):(<UserOutlined style={{
                    fontSize:'30px',
                    marginLeft: '10px'
                  }}/>)}
                  
                  {user?.access_token?(
                    <>
                    <Popover content={content} trigger="click" overlayClassName="custom-popover">
                        <div style={{cursor: 'pointer', fontSize: '16px', fontWeight: '500'}}>{userName?.length ? userName: user?.email  } <CaretDownFilled style={{fontSize: '13px'}} /></div>
                    </Popover>
                    </>
                  ): (
                    <div  onClick={handleNavigateLogin}>
                  <WrapperTextHeaderSmall>Đăng nhập / Đăng ký</WrapperTextHeaderSmall> 
                    <div>   
                        <WrapperTextHeaderSmall>Tài Khoản</WrapperTextHeaderSmall> 
                      <CaretDownOutlined/>
                    </div>
                  </div>
                  )}
                  {!isHiddentCard && 
                  <div onClick={()=>nagivate('/order')} >
                    <Badge count= {order?.orderItems?.length}>
                      <ShoppingCartOutlined style={{
                      fontSize: '30px'
                    }}/>
                    </Badge>
                    <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall> 
                  </div>}
                </WrapperHeaderAccount>
          </Loading>
        
          
        </Col>
      
      </WrapperHeader>
    </div>
  )
}

export default HeaderComponent