import React from 'react'
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent'
import { useNavigate, useParams } from 'react-router-dom'
import './ProductDetailsPage.scss'

const ProductDetailsPage = () => {
  const {id} = useParams();
  const nagivate = useNavigate()
  return (
    
    <div style={{padding:'0 120px', background: '#efefef', height: '1000px'}}>
        <h4 style={{marginTop: '0', paddingTop: '10px'}}><span className='home' onClick={()=>nagivate('/')}>Trang chủ</span> - Chi tiết sản phẩm </h4>
         <ProductDetailsComponent idProduct = {id}/>

    </div>
  )
}

export default ProductDetailsPage