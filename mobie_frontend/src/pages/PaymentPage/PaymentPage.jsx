import { Col, Divider, Row, Button, Form, Input,Radio, Space } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import './PaymentPage.scss'
import { useDispatch, useSelector } from 'react-redux'
import { converPeice } from '../../../utils'
import ModalComponent from '../../components/ModalComponent/ModalComponent'
import * as UserService from '../../services/UserService'
import * as OrderService from '../../services/OrderService'
import * as PaymentService from '../../services/PaymentService'
import { useMutationHook } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import { toast } from 'react-toastify'
import { updateUser } from '../../redux/slice/userSlide'
import { useNavigate } from 'react-router-dom'
import { removeAllOrderProduct } from '../../redux/slice/orderSlide'
import { PayPalButton } from 'react-paypal-button-v2'

const PaymentPage = () => {
  const dispatch = useDispatch()
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)
  const orderItems = order?.orderItemsSelected;
  const [deliveryMethod, setDeliveryMethod] = useState('FAST');
  const [payment, setPayment] = useState('CASH');
  const navigate = useNavigate();
  const [sdkReady, setSdkReady] = useState(false);

  const [isModalOpenUpdateInfor, setIsModalOpenUpdateInfor] = useState(false)
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  })

  const [form] = Form.useForm()

  const priceMemo = useMemo(() => {
    return orderItems?.reduce((total, item) => total + item.price * item.amount, 0) || 0
  }, [orderItems])

  const discountMemo = useMemo(() => {
    return orderItems?.reduce((total, item) => total + item.discount * item.amount, 0) || 0
  }, [orderItems])

  const deliveryMemo = useMemo(() => {
    if (priceMemo > 200000) return 10000
    if (priceMemo === 0) return 0
    return 20000
  }, [priceMemo])

  const totalPrice = useMemo(() => {
    return priceMemo - discountMemo + deliveryMemo
  }, [priceMemo, discountMemo, deliveryMemo])

  useEffect(() => {
    if (isModalOpenUpdateInfor) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone
      })
    }
  }, [isModalOpenUpdateInfor])

  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [stateUserDetails, form])

  const handleChangeUserInfo = () => setIsModalOpenUpdateInfor(true)

  const handleCancelUpdate = () => {
    setStateUserDetails({ name: '', phone: '', city: '', address: '' })
    setIsModalOpenUpdateInfor(false)
    form.resetFields()
  }

  const mutationUpdate = useMutationHook(async (data) => {
    const { id, token, ...rests } = data
    return await UserService.updateUser(id, { ...rests }, token)
  })
  const mutationAddOrder = useMutationHook(async (data) => {
          const {token, ...rests } = data;
          console.log('data', data)
          const res = await OrderService.createOrder(user?.id,{...rests},token);
          if(res.status === 'OK'){
            toast.success('Đặt hàng thành công')
            const arrayOrder = [];
            order?.orderItemsSelected.forEach((element)=>{
              arrayOrder.push(element.product)
            })
            dispatch(removeAllOrderProduct({listChecked:arrayOrder}))
            navigate('/orderSuccess', {
              state: {
                deliveryMethod,
                payment,
                orders: order?.orderItemsSelected,
                totalPriceMemo: totalPrice
              }
            })
          }
          else{
            toast.error(res.message)
          }
          return res;
      });
      const {isPending: isPendingAddOrder} = mutationAddOrder

  const handleUpdateUserInfo = () => {
    const { name, address, city, phone } = stateUserDetails
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        {...stateUserDetails,
          id: user?.id,
          token: user?.access_token,
          
        },
        {
          onSuccess: () => {
            dispatch(updateUser({ ...user, name, address, city, phone, _id: user?.id }))
            toast.success('Cập nhật thông tin thành công!')
            setIsModalOpenUpdateInfor(false)
          }
        }
      )
    }
  }

  const handleOnChangeDetails = (e) => {
    setStateUserDetails({ ...stateUserDetails, [e.target.name]: e.target.value })
  }

  const onSuccessPaypal = (details)=>{
     mutationAddOrder.mutate({token: user?.access_token, 
          orderItems : order?.orderItemsSelected,
          fullName: user?.name,
          address: user?.address,
          phone: user?.phone,
          city: user?.city,
          paymentMethod: payment,
          itemsPrice: priceMemo,
          shippingPrice: deliveryMemo,
          totalPrice: totalPrice,
          user: user?.id,
          isPaid: true,
          paiAt: details.update_time
        })
  }


  const handleAddOrder = () => {
    if(user?.access_token && order?.orderItemsSelected && user?.name && user?.address &&
      user?.phone && user?.city && priceMemo && user?.id){
          mutationAddOrder.mutate({token: user?.access_token, 
          orderItems : order?.orderItemsSelected,
          fullName: user?.name,
          address: user?.address,
          phone: user?.phone,
          city: user?.city,
          paymentMethod: payment,
          itemsPrice: priceMemo,
          shippingPrice: deliveryMemo,
          totalPrice: totalPrice,
          user: user?.id,
    })
    }
    
  }
  const addPaypalScript = async ()=>{
    const {data} = await PaymentService.getConfig();
    const script = document.createElement('script');
    script.type = 'text/javascript'
    script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
    script.async = true;
    script.onload = ()=>{
      setSdkReady(true)
    }
    document.body.appendChild(script)
  }

  useEffect(()=>{
    if(!window.paypal){
      addPaypalScript()
    }
    else{
      setSdkReady(true)
    }
  },[])

  return (
    <div style={{ background: '#f5f5fa', padding: '10px 120px' }}>
      <Loading  isPending={isPendingAddOrder}>
        <h2>Thanh toán</h2>
        <div className='cart-container'>
          <div className='cart-product'>

  <div className="delivery-payment-container">
        <div className="section">
          <h3>Chọn phương thức giao hàng</h3>
          <Radio.Group
            onChange={(e) => setDeliveryMethod(e.target.value)}
            value={deliveryMethod}
          >
            <Space direction="vertical" className="radio-box">
              <Radio value="FAST">
                <span className="fast">FAST</span> Giao hàng tiết kiệm
              </Radio>
              <Radio value="GO_JEK">
                <span className="gojek">GO_JEK</span> Giao hàng tiết kiệm
              </Radio>
            </Space>
          </Radio.Group>
        </div>

        <div className="section">
          <h3>Chọn phương thức thanh toán</h3>
          <Radio.Group
            onChange={(e) => setPayment(e.target.value)}
            value={payment}
          >
            <div className="radio-box">
              <Radio value="CASH">Thanh toán tiền mặt khi nhận hàng</Radio>
              <Radio value="Paypal">Thanh toán tiền bằng paypal</Radio>
            </div>
          </Radio.Group>
        </div>
      </div>


          </div>

          <div className='cart-summary'>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
              <span style={{ marginRight: '10px' }}>Địa chỉ:</span>
              <span style={{ color: 'blue', textDecoration: 'underline', marginRight: '10px' }}>
                {`${user?.address} - ${user?.city}`}
              </span>
              <span style={{ cursor: 'pointer' }} onClick={handleChangeUserInfo}>
                Thay đổi
              </span>
            </div>
            <Divider />
            <div>
              <div className='summary-row'>
                <span>Tạm tính</span>
                <span>{converPeice(priceMemo)}</span>
              </div>
              <div className='summary-row'>
                <span>Giảm giá</span>
                <span>{converPeice(discountMemo)}</span>
              </div>
              <div className='summary-row'>
                <span>Phí giao hàng</span>
                <span>{converPeice(deliveryMemo)}</span>
              </div>
              <Divider />
              <div className='summary-row total'>
                <span>Tổng tiền</span>
                <span className='summary-total'>{converPeice(totalPrice)}</span>
              </div>
              <p className='vat-text'>(Đã bao gồm VAT nếu có)</p>

              {payment ==='Paypal' && sdkReady ? (
                <PayPalButton
                  amount={Number((totalPrice / 25000).toFixed(2))}
                  // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                  onSuccess={onSuccessPaypal}
                  onError={()=>{
                    alert('ERROR')
                  }}
                />
              ):(
                <Button type='primary' danger block size='large' onClick={handleAddOrder}>
                Đặt hàng
              </Button>
              )}
              
            </div>
          </div>
        </div>

        <ModalComponent
          title='Cập nhật thông tin giao hàng'
          open={isModalOpenUpdateInfor}
          onCancel={handleCancelUpdate}
          onOk={handleUpdateUserInfo}
        >
          <Loading isPending={mutationUpdate.isPending}>
            <Form
              name='basic'
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 19 }}
              style={{ maxWidth: 600 }}
              form={form}
              autoComplete='off'
            >
              <Form.Item label='Name' name='name' rules={[{ required: true, message: 'Please input your name!' }]}>
                <Input value={stateUserDetails.name} onChange={handleOnChangeDetails} name='name' />
              </Form.Item>
              <Form.Item label='City' name='city' rules={[{ required: true, message: 'Please input your city!' }]}>
                <Input value={stateUserDetails.city} onChange={handleOnChangeDetails} name='city' />
              </Form.Item>
              <Form.Item
                label='Phone'
                name='phone'
                rules={[{ required: true, message: 'Please input your phone number!' }]}
              >
                <Input value={stateUserDetails.phone} onChange={handleOnChangeDetails} name='phone' />
              </Form.Item>
              <Form.Item
                label='Address'
                name='address'
                rules={[{ required: true, message: 'Please input your address!' }]}
              >
                <Input value={stateUserDetails.address} onChange={handleOnChangeDetails} name='address' />
              </Form.Item>
            </Form>
          </Loading>
        </ModalComponent>
      </Loading>
    </div>
  )
}

export default PaymentPage
