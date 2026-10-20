import React from 'react';
import { Row, Col, Typography, Card } from 'antd';
import './DetailsOrderPage.scss';
import { useLocation, useParams } from 'react-router-dom';
import * as OrderService from '../../services/OrderService';
import { useQuery } from '@tanstack/react-query';
import { converPeice } from '../../../utils';
import { orderContant } from '../../contant';


const { Title, Text } = Typography;

const DetailsOrderPage = () => {
    const params = useParams();
    const location = useLocation();
    const {state} = location
    const {id} = params

     const fetchDetailsOrder = async ()=>{
    const res = await OrderService.getDetailsOrder(id, state?.token)
    return res.data
  }
  const queryOrder = useQuery({ queryKey: ['order-details'], queryFn: fetchDetailsOrder, enabled: !!id && !!state?.token });
  const { isPending, data } = queryOrder

  console.log("dataaa", data)

   
  return (
    <div className="order-detail-container">
      <Title level={4}>Chi tiết đơn hàng</Title>

      <Row gutter={24} className="order-info-section">
        <Col span={8}>
          <Card title="ĐỊA CHỈ NGƯỜI NHẬN" className="order-card">
            <Text strong>{data?.shippingAddress?.fullName}</Text>
            <p>Địa chỉ: {data?.shippingAddress?.address} - {data?.shippingAddress?.city}</p>
            <p>Điện thoại: {data?.shippingAddress?.phone}</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="CHI TIẾT" className="order-card">
            <p><Text strong style={{ color: '#fa8c16' }}>FAST</Text> Giao hàng tiết kiệm</p>
            <p>Phí giao hàng: {converPeice(data?.shippingPrice)}</p>
            <p style={{color: 'red', fontWeight: '600'}}>Tổng tiền: {converPeice(data?.totalPrice)}</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="HÌNH THỨC THANH TOÁN" className="order-card">
            <p>{orderContant.payment[data?.paymentMethod]}</p>
            <Text type="danger">{data?.isPaid ? 'Đã thanh toán' : ' Chưa thanh toán'}</Text>
          </Card>
        </Col>
      </Row>
    
      <div className="order-product-section">
        <div className="product-row">
          <div className="product-info">
            Sản Phẩm
          </div>
          <div className="product-detail">Giá</div>
          <div className="product-detail"> Số Lượng</div>
          <div className="product-detail">Giảm giá</div>
          <div className="product-detail">Phí vận chuyển</div>
          <div className="product-detail">Tạm tính</div>
        </div>


        {data?.orderItems?.map((item)=>{
          return (
              <div style={{fontWeight: 'bold'}} className="product-row">
                <div className="product-info">
                  <img src={item?.image} alt="product" />
                  <span>{item?.name}</span>
                </div>
                <div className="product-detail">{converPeice(item?.price)}</div>
                <div className="product-detail">{item?.amount}</div>
                <div className="product-detail">0</div>
                <div className="product-detail">{data?.shippingPrice}</div>
                <div className="product-detail">{converPeice(item?.price * item?.amount)}</div>
              </div>
        )})}
        
      </div>
    </div>
  );
};

export default DetailsOrderPage;
