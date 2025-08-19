import Reac from 'react'
import * as OrderService from '../../services/OrderService';
import Loading from '../../components/LoadingComponent/Loading';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Col, Divider, Row } from 'antd';
import './MyOrderPage.scss'
import { converPeice } from '../../../utils';
import { useMutationHook } from '../../hooks/useMutationHook';
import { toast } from 'react-toastify';


const MyOrderPage = () => {
  const {state}  = useLocation();
  const nagivate = useNavigate();
  const fetchMyOrder = async ()=>{
    const res = await OrderService.getOrderbyUserId(state?.id, state?.token)
    return res.data
  }
  const queryOrder = useQuery({ queryKey: ['order'], queryFn: fetchMyOrder });
  const { isPending, data, refetch } = queryOrder


 const handleDetailsOrder = (id)=>{
  nagivate(`/details-order/${id}`,{
    state: {token: state?.token}
  })
 }

 const mutation = useMutationHook(async (data) => {
         const { id, token } = data;
         const res = await OrderService.cancelOrder(id,token);
         if(res?.status ==='OK'){
          toast?.success('Đã hủy đơn')
         }
         else{
          toast.error(res?.message)
         }
         return res;
     });

 const handleCancelOrder = (id)=>{
  mutation.mutate({id, token: state?.token},{
                onSettled: () => {
                    refetch();
                },
            })
 }
  return (
    <Loading isPending={isPending}>
      <div style={{background: '#f5f5fa', padding: '10px  120px'}}>
        {data?.length >0 && data?.map((order)=>{
          return (
              <div className='myorder-card'>
                <div className='myorder-top'>
                  <h3>Trạng thái</h3>
                  <div style={{display: 'flex', gap: '50px'}}>
                    <div style={{flex: 5}}>
                    <p> <span style={{color: 'red'}}> Giao hàng: </span> {order?.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng'}</p>
                    <p>< span style={{color: 'red'}}> Thanh toán: </span>{order?.isPaid? 'Đã thanh toán': 'Chưa thanh toán'}</p>
                  </div>
                  <div style={{flex: 5}}>
                    <p>< span style={{color: 'red'}}> Thời gian: </span>{new Date(order?.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</p>
                  </div>
                  </div>
                </div>
                <Divider />
                <div className='myorder_content'>
                  {order?.orderItems?.map((item)=>{
                    return (
                        <Row className="cart-item" align="middle">
                        <Col span={20} className="cart-product" style={{display: 'flex', alignItems: 'center', justifyContent: 'start'}} >
                            <img
                              src={item?.image}
                              alt="product"
                              className="product-image"
                            />
                            <span style={{fontSize: '16px'}}>{item?.name}</span>
                        </Col>
                        <Col span={4} style={{textAlign: 'center'}}>
                          <span style={{color: 'red', fontWeight: 'bold'}} className="total-price">{converPeice(item?.price * item?.amount)}</span>
                        </Col>
                      </Row>
                    )
                  })}
                  
                </div>
                <Divider />
                <div className="myoder-bottom">
                  <div className="button_bottom">
                    <p className="total-price">{converPeice(order?.totalPrice)}</p>
                    <div className="action-buttons">
                      <Button onClick={()=>{handleCancelOrder(order?._id)}} style={{ marginRight: '10px' }} color="primary" variant="outlined">Hủy đơn hàng</Button>
                      <Button  onClick={()=>{handleDetailsOrder(order?._id)}} color="primary" variant="outlined">Xem chi tiết</Button>
                    </div>
                  </div>
                </div>
              </div>     
          )
        })}
        
    </div>
    </Loading>
    
    
  )
}

export default MyOrderPage