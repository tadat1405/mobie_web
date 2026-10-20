import { Col, Divider, Row, Button, Form, Input,Radio, Space } from 'antd'
import React from 'react'
import './OrderSuccess.scss'
import { useDispatch, useSelector } from 'react-redux'
import ModalComponent from '../../components/ModalComponent/ModalComponent'
import * as UserService from '../../services/UserService'
import * as OrderService from '../../services/OrderService'
import Loading from '../../components/LoadingComponent/Loading'
import { useLocation } from 'react-router-dom'
import { orderContant } from '../../contant'
import { converPeice } from '../../../utils'


const OrderSuccess = () => {
  const dispatch = useDispatch()
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)
  const location = useLocation();
  const {state} = location;
  console.log('location', location)
  return (
    <div style={{ background: '#f5f5fa', padding: '10px 120px' }}>
      <Loading  isPending={false}>
        <h2>Đơn hàng đặt thành công</h2>
        <div className='cart-container'>
          <div className='cart-product'>

            <div className="delivery-payment-container">
                <div className="section-done">
                    <h4>Phương thức giao hàng</h4>
                    <div className="radio-boxed">
                        <span className="fasted">{orderContant.deliveryMethod[state?.deliveryMethod]}</span> Giao hàng tiết kiệm
                    </div>
                    <h4>Phương thức thanh toán</h4>
                    <div className="radio-boxed">
                        <span>{orderContant.payment[state?.payment]}</span>
                    </div>
                </div>
                <div className='section-done'>
                    {state?.orders?.map((order)=>{
                        return (
                            <Row className="cart-item" align="middle">
                        <Col span={13} className="cart-product" style={{display: 'flex', alignItems: 'center', justifyContent: 'start'}} >
                            <img
                            src={order?.image}
                            alt="product"
                            className="product-image"
                            />
                            <span>{order?.name}</span>
                        </Col>
                        <Col style={{textAlign:'start'}} span={9}>
                            {/* <del style={{color: '#ccc', marginRight: '10px'}} className="price-original">211</del> */}
                             <span style={{color: 'red', fontWeight: 'bold'}} className="total-price">Giá tiền: {converPeice(order?.price)}</span>
                        </Col>
                        <Col  span={3}>
                           <span >Số lượng: {order?.amount}</span>
                        </Col>
                    </Row>
                        )
                    })
                    }
                    <div style={{fontSize: '18px', paddingTop: '10px'}}>
                        <span style={{marginRight: '10px'}}> Tổng tiền: </span><span style={{color: 'red', fontWeight: '600'}}>{converPeice(state?.totalPriceMemo)}</span>
                    </div>
                    
                </div>
            </div>
        </div>
        </div>
      </Loading>
    </div>
  )
}

export default OrderSuccess
