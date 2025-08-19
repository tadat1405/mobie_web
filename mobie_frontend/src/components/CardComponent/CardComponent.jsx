import { Card } from 'antd'
import Meta from 'antd/es/card/Meta'
import React from 'react'
import './CardComponent.scss'
import { StarFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { converPeice } from '../../../utils'


const CardComponent = (props) => {
   const { countInStock, description, image, name, price, rating, type, discount, selled, id} = props
   const nagivate = useNavigate();

   const handleDetailsProduct = (id)=>{
      nagivate(`/product-details/${id}`)
      console.log("thẻ", id)
   }
  return (
     <Card
        hoverable
        style={{ width: '240px', height: '400px' }}
        cover={<img alt="example" src={image} className="avataCard"/>}
        onClick={()=>handleDetailsProduct(id)}
     >
        <div className='style-name_product'>{name}</div>
        <div className='wrapper_report_text'>
            <span>{rating}</span>
            <span><StarFilled style={{color: "yellow",fontSize: '12px'}}/></span>
            <span> | Đã bán {selled  ||1000 }+ </span>
        </div>
        <div className='wrapper_price_text'>
            { converPeice(price) }&nbsp;&nbsp; - {discount || 5 }%
        </div>
     </Card>
  )
}

export default CardComponent