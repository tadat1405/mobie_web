import React, { useState } from 'react'
import { Badge, Popover } from 'antd';
import { CaretDownFilled, SearchOutlined, ShoppingCartOutlined, UserOutlined, HeartOutlined } from '@ant-design/icons';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService';
import * as ProductService from '../../services/ProductService';
import { resetUser } from '../../redux/slice/userSlide';
import Loading from '../LoadingComponent/Loading';
import { BRAND } from '../../brand';
import { sortTypes, toTypePath } from '../../constants/categories';
import { searchProduct } from '../../redux/slice/productSlice';

const menuItem = 'block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-lg cursor-pointer'

const Logo = ({ onClick }) => (
  <button type='button' onClick={onClick} className='mx-auto flex flex-col items-center leading-none select-none'>
    <span className='flex items-center gap-2 text-brand-600'>
      <svg width='34' height='30' viewBox='0 0 34 30' fill='none' stroke='currentColor' strokeWidth='2' strokeLinejoin='round'>
        <path d='M8 2h18l7 8-16 18L1 10z' /><path d='M1 10h32M12 2l5 8 5-8M17 10v18' />
      </svg>
      <span className='text-3xl font-bold tracking-wide'>{BRAND.name}</span>
    </span>
    <span className='mt-1 text-[10px] font-semibold uppercase tracking-[0.45em] text-brand-500'>{BRAND.slogan}</span>
  </button>
)

const HeaderComponent = ({isHiddenSearch = false,isHiddentCard= false}) => {
  const dispatch = useDispatch();
  const nagivate = useNavigate();
  const location = useLocation();
  const user = useSelector((state)=>state.user)
  const order = useSelector((state)=>state.order)
  const [loading, setLoading] = useState(false);

  const { data: typesRes } = useQuery({
    queryKey: ['all-types'],
    queryFn: ProductService.getAllTypeProduct,
    staleTime: 10 * 60 * 1000,
    enabled: !isHiddenSearch,
  })
  const types = sortTypes(typesRes?.data || [])

  const handleLogout = async ()=>{
    setLoading(true)
    await UserService.logoutUser();
    dispatch(resetUser());
    setLoading(false)
    nagivate('/')
  }

  const content = (
    <div className='w-52 flex flex-col gap-0.5'>
      <button className={menuItem} onClick={()=>nagivate('/profile-user')}>Thông tin người dùng</button>
      {user?.isAdmin && <button className={menuItem} onClick={()=>nagivate('/system/admin')}>Quản lý hệ thống</button>}
      <button className={menuItem} onClick={()=>nagivate('/my-order',{state:{id: user?.id, token: user?.access_token}})}>Đơn hàng của tôi</button>
      <button className={`${menuItem} !text-rose-600`} onClick={handleLogout}>Đăng xuất</button>
    </div>
  )

  return (
    <header className='sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-brand-100'>
      <div className='mx-auto grid max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-4'>
        <div>
          {!isHiddenSearch && (
            <label className='flex w-full max-w-60 items-center gap-2 rounded-full border border-brand-100 bg-brand-50/60 px-4 py-2 focus-within:border-brand-500 focus-within:bg-white'>
              <SearchOutlined className='text-brand-500' />
              <input
                className='w-full bg-transparent text-sm outline-none placeholder:text-slate-400'
                placeholder='Tìm kiếm...'
                onChange={(e)=>{ dispatch(searchProduct(e.target.value)); if(location.pathname !== '/' && !location.pathname.startsWith('/product/')) nagivate('/') }}
              />
            </label>
          )}
        </div>

        {isHiddenSearch
          ? <div className='text-center text-xl font-bold text-brand-600'>Quản trị viên</div>
          : <Logo onClick={()=>nagivate('/')} />}

        <Loading isPending={loading}>
          <div className='flex items-center justify-end gap-5 text-slate-700'>
            {user?.access_token ? (
              <Popover content={content} trigger='click' placement='bottomRight'>
                <div className='flex cursor-pointer items-center gap-2'>
                  {user?.avatar?.length
                    ? <img className='h-9 w-9 rounded-full object-cover ring-2 ring-brand-100' src={user.avatar} alt='avatar' />
                    : <span className='grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-brand-600'><UserOutlined /></span>}
                  <span className='max-w-[130px] truncate text-sm font-medium'>{user?.name?.length ? user.name : user?.email}</span>
                  <CaretDownFilled className='text-[11px] text-slate-400' />
                </div>
              </Popover>
            ) : (
              <button onClick={()=>nagivate('/sign-in')} className='flex items-center gap-2 rounded-full border border-brand-500 px-4 py-1.5 text-sm font-semibold text-brand-600 transition hover:bg-brand-600 hover:text-white'>
                <UserOutlined /> Đăng nhập
              </button>
            )}
            {!isHiddentCard && (
              <button onClick={()=>nagivate('/order')} className='transition hover:text-brand-600' aria-label='Giỏ hàng'>
                <Badge count={order?.orderItems?.length} size='small' color='#e8707a' offset={[2, -2]}>
                  <ShoppingCartOutlined className='text-2xl' />
                </Badge>
              </button>
            )}
            {!isHiddenSearch && <HeartOutlined className='hidden text-2xl md:block' />}
          </div>
        </Loading>
      </div>

      {!isHiddenSearch && (
        <nav className='site-nav mx-auto flex max-w-[1400px] flex-wrap justify-center gap-x-9 gap-y-1 px-6 pb-3 text-[13px] font-semibold uppercase tracking-wide text-slate-700'>
          <NavLink to='/' end className={({isActive})=>`pb-1 transition hover:text-brand-600 ${isActive ? 'text-brand-600' : 'text-slate-700'}`}>Trang chủ</NavLink>
          {types.map((t)=>(
            <NavLink key={t} to={toTypePath(t)} state={t}
              className={({isActive})=>`pb-1 transition hover:text-brand-600 ${isActive ? 'border-b-2 border-brand-500 text-brand-600' : 'text-slate-700'}`}>
              {t}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}

export default HeaderComponent
