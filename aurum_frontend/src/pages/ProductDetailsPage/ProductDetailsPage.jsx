import React from 'react'
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent'
import { useNavigate, useParams } from 'react-router-dom'
import BackButton from '../../components/BackButton/BackButton'

const ProductDetailsPage = () => {
  const {id} = useParams();
  const nagivate = useNavigate()
  return (
    <div className='mx-auto max-w-[1400px] px-6 py-5 min-h-[70vh]'>
      <div className='mb-4 flex items-center gap-4'>
        <BackButton />
        <nav className='text-sm text-slate-500'>
          <button type='button' className='hover:text-brand-600' onClick={()=>nagivate('/')}>Trang chủ</button>
          <span className='mx-2'>/</span>
          <span className='text-slate-800'>Chi tiết sản phẩm</span>
        </nav>
      </div>
      <ProductDetailsComponent key={id} idProduct={id}/>
    </div>
  )
}

export default ProductDetailsPage
