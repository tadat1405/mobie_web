import React, { useEffect } from 'react'
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import { Col, Pagination, Row } from 'antd'
import './TypeProductPage.scss';
import { useLocation } from 'react-router-dom';
import * as ProductService from '../../services/ProductService';
import { useState } from 'react';
import Loading from '../../components/LoadingComponent/Loading';
import { useSelector } from 'react-redux';
import { useDebounce } from '../../hooks/useDebounce';

const TypeProductPage = () => {
  const {state} = useLocation();
  const [products, setProsucts] = useState([])
  const [loading, setLoading] = useState(false);
  const searchProduct = useSelector((state)=>state?.product?.search)
  const searchDebounce = useDebounce(searchProduct,500)
  const [panigate, setPanigate] = useState({
    page: 0, 
    limit: 10,
    total: 1,
  })
  
  const fetchProductType = async (type,page, limit)=>{
      setLoading(true)
     const res =  await ProductService.getProductType(type,page, limit)
      if(res?.status === 'OK'){
        setProsucts(res?.data);
        setPanigate({...panigate, total: res?.totalPage})
           setLoading(false)
      }else{
           setLoading(true)
      }
    }
    useEffect(()=>{
      if(state){
        fetchProductType(state, panigate.page, panigate.limit); 
      }
    },[state,panigate.page, panigate.limit]);

  const onchange = (current, pageSize)=>{
    console.log({current,pageSize})
    setPanigate({...panigate, page: current-1, limit: pageSize})

  }
  return (
    <Loading isPending={loading}>
      <div style={{ padding: '10px  120px', backgroundColor:'#efefef',minHeight: '100vh'}}>
        <Row style={{ flexWrap:'nowrap', paddingTop: '10px'}}>
            <Col span={4} style={{ background: '#fff', paddingTop: '10px', borderRadius: '6px'}}>
                 <NavbarComponent />
            </Col>
            <Col span={20}  style={{
              height: '100vh'
            }}>
                <div className='type_product_page' >
                  {products?.filter((pro)=>{
                    if(searchDebounce === ''){
                      return pro
                    }else if(pro?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase())){
                      return pro
                    }
                  })?.map((product)=>{
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
                <Pagination
                  style={{display: 'flex', justifyContent: 'center'}}
                  onChange={onchange}
                  defaultCurrent={panigate?.page+1}
                  total={panigate.total}
                />
            </Col>
        </Row>
        
      </div>
    </Loading>
  )
}

export default TypeProductPage