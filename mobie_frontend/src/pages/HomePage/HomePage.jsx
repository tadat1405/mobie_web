import React, { useEffect, useState } from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct';
import './HomePage.scss'
import SliderComponent from '../../components/SliderComponent/SliderComponent';
import slider1 from '../../assets/images/slider1.jpg'
import slider2 from '../../assets/images/slider2.jpg'
import slider3 from '../../assets/images/slider3.jpg'
import CardComponent from '../../components/CardComponent/CardComponent';
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { Button } from 'antd';
import { useQuery } from '@tanstack/react-query';
import * as ProductService from '../../services/ProductService'
import { useSelector } from 'react-redux';
import { useDebounce } from '../../hooks/useDebounce';
import Loading from '../../components/LoadingComponent/Loading';


const HomePage = () => {
  const searchProduct = useSelector((state)=>state?.product?.search)
  const [stateProduct, setStateProduct] = useState('')
  const [typeProducts, setTypeProducts] = useState([])
  const searchDebounce = useDebounce(searchProduct,500)
  const [limit, setLimit ]= useState(5)

  const fetchProductAll = async (context)=> {
    const limit = context?.queryKey && context.queryKey[1]
    const search = context?.queryKey && context.queryKey[2]
      const  res = await ProductService.getAllProduct(search,limit);
      return res;
  }



  const {data: products,isFetching} = useQuery({
    queryKey: ['products', limit,searchDebounce], 
    queryFn: fetchProductAll, 
    retry: 3, retryDelay: 1000});


  useEffect (()=>{
    if(products?.data?.length > 0){
      setStateProduct(products?.data)
    }
  },[products])

  const fetchAllTypeProduct = async ()=>{
    const res = await ProductService.getAllTypeProduct()
    if(res?.status === 'OK'){
       setTypeProducts(res?.data)
    }
  }
  
  useEffect(()=>{
    fetchAllTypeProduct()
  },[])
  return (
    <div style={{padding: '0 120px', backgroundColor: "#efefef"}}>
       <div className='type_product'>
        {
        typeProducts?.map((item)=>{
          return (
           <TypeProduct name = {item} key = {item}/>
          )
        })
      }
      </div> 
        <div id="container" style={{}}>
            <SliderComponent arrImages={[slider1, slider2, slider3]}/>
          <div  style={{
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap:'wrap',
            gap: '20px'
          }}>
            {stateProduct?.length> 0 &&stateProduct?.map((product)=>{
              return (
            <CardComponent
            key={product._id}
            countInStock= {product.countInStock}
            description= {product.description}
            image = {product.image}
            name = {product.name}
            price = {product.price}
            rating= {product.rating}
            type = {product.type}
            dicount = {product.dicount}
            selled = {product.selled}
            id = {product._id}
            />
              )
            })}
         </div>
            {isFetching && (
              <div style={{ textAlign: 'center', marginTop: 20 }}>
              <span>Đang tải thêm sản phẩm...</span>
          </div>
          )}
         <div style={{textAlign: 'center'}}>
            <button  className='watch_more'onClick={()=>{setLimit((prev)=>prev +10) }}> <span> Xem thêm</span></button>
         </div>
      </div>
    </div>
  )
}

export default HomePage