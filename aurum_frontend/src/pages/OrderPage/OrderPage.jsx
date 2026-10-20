import { DeleteOutlined } from '@ant-design/icons'
import { Checkbox, Col, Divider, InputNumber, Row, Button } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import './OrderPage.scss'
import { useDispatch, useSelector } from 'react-redux';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../redux/slice/orderSlide';
import { converPeice } from '../../../utils';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import {Form, Input } from 'antd';
import * as UserService from '../../services/UserService';
import { useMutationHook } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import { toast } from 'react-toastify';
import { updateUser } from '../../redux/slice/userSlide';
import { useNavigate } from 'react-router-dom';
import StepComponent from '../../components/StepComponent/StepComponent';


const OrderPage = () => {
  const dispath = useDispatch();
  const [listChecked, setListChecked] = useState([])
  const order = useSelector((state)=>state.order)
  const user = useSelector((state)=>state.user)
  const [isModalOpenUpdateInfor, setIsModalOpenUpdateInfor] = useState(false)
  const nagivate = useNavigate();
   const [stateUserDetails, setStateUserDetails] = useState({
          name: '',
          phone: '',
          address: '',
          city: ''
      });
      const [form] = Form.useForm();
  const priceMemo = useMemo(()=>{
    const result = order?.orderItemsSelected?.reduce((total, current)=>{return  total + (current.price * current.amount)},0)
    return result
  }, [order])

  const discountMemo = useMemo(()=>{
    const result = order?.orderItemsSelected?.reduce((total, current)=>{return  total + (current.discount * current.amount)},0)
    if(Number(result)){
      return result
    }
    return 0
  }, [order])

  const diliveryMemo = useMemo(()=>{
    if(priceMemo >= 200000 && priceMemo < 500000){
      return 10000
    }
    else if(priceMemo >=500000 || order?.orderItemsSelected?.length === 0 ){
      return 0
    }
    else {
      return 20000
    }
  }, [priceMemo])

  const totalPrice = useMemo(()=>{
    return Number(priceMemo )- Number(discountMemo) + Number(diliveryMemo)
  },[priceMemo,discountMemo, diliveryMemo])

  useEffect(()=>{
    dispath(selectedOrder({listChecked}))
  },[listChecked])
  
  useEffect(()=>{
    if(isModalOpenUpdateInfor){
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone,
      })
    }
  }, [isModalOpenUpdateInfor])

   useEffect(() => {
          form.setFieldsValue(stateUserDetails);
      }, [stateUserDetails, form]);

const handleOnchangAddress = ()=>{
  setIsModalOpenUpdateInfor(true)
}

const onChange = (e) => {
  const value = e.target.value;
  const checked = e.target.checked;
  if (checked) {
    setListChecked((prev) => [...prev, value]);
  } else {
    setListChecked((prev) => prev.filter((item) => item !== value));
  }
};

const handleOnChangeCheckAll = (e)=>{
  const checked = e.target.checked;
  if(checked){
    const newListChecked = []
     order?.orderItems?.forEach((item)=>{
      newListChecked.push(item?.product)
  })
  setListChecked(newListChecked)
  }else{
    setListChecked([])
  }
}
const handleRemoveAllOder = ()=>{
  if(listChecked?.length > 1){
   dispath(removeAllOrderProduct({listChecked}))
  }
}
const handleChangeCount = (type, idProduct)=>{
  if(type === 'increase'){
    dispath(increaseAmount({idProduct}))
  }else if (type ==='decrease'){
    dispath(decreaseAmount({idProduct}))
  }
}
const handleDeleteOrder = (idProduct)=>{
  dispath(removeOrderProduct({idProduct}))
}
const handleAddCard = ()=>{
  console.log("user", user)
  if(!order.orderItemsSelected?.length){
      toast.error('Vui lòng chọn sản phẩm')
  }
  else if(!user?.phone ||  !user?.address || !user?.name || !user?.city){
    setIsModalOpenUpdateInfor(true)
  }else{
    nagivate('/payment')
  }
}
const handleCancelUpdate = ()=>{
  setStateUserDetails({
            name: '',
            phone: '',
            city: '',
            address: ''
        });
  setIsModalOpenUpdateInfor(false)
  form.resetFields()
}


console.log('user', user?.id);
const handleUpdateInforUser = () => {
  const { name, address, city, phone } = stateUserDetails;

  if (name && address && city && phone) {
    mutationUpdate.mutate(
      {...stateUserDetails,
        id: user?.id,
        token: user?.access_token,
      },
      {
        onSuccess: (res) => {
          dispath(
            updateUser({
              ...user,
              name,
              address,
              city,
              phone,
              access_token: user?.access_token,
              _id: user?.id
            })
          );

          toast.success("Cập nhật thông tin thành công!");
          setIsModalOpenUpdateInfor(false);
        },
      }
    );
  }
};
console.log('user', user?.id)

 const mutationUpdate = useMutationHook(async (data) => {
        const { id, token, ...rests } = data;
        const res = await UserService.updateUser(id, {...rests},token);
        return res;
    });
    const {isPending} = mutationUpdate;


const handleOnchangDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value,
        });
    };

const itemsDelivery=[
      {
        title: '20.000 VND',
        description: "Dưới 200.000 VND",
      },
      {
        title: '10.000 VND',
        description: 'Từ 200.000 VND đến dưới 500.000 VND',
        subTitle: 'Left 00:00:08',
      },
      {
        title: '0 VND',
        description: 'Trên 500.00 VND',
      },
    ]

  return (
    <div style={{background: '#f5f5fa', padding: '10px  120px'}}>
        <h2>Giỏ hàng</h2>
        <div className='cart-container' >
          <div className='style-header'>
          </div>
          <div className='cart-product'>
            <Row className="cart-header">
             <StepComponent items= {itemsDelivery}
             current={diliveryMemo === 10000 ? 2: diliveryMemo ===2000 ? 1: order?.orderItemsSelected.length === 0 ? 0 : 3}
             />
            <Divider />

              <Col style={{display: 'flex', alignItems: 'center', justifyContent: 'start'}} span={10}>
                <Checkbox onChange={handleOnChangeCheckAll}
                checked={listChecked?.length === order?.orderItems?.length}
                >  
                  Tất cả ({order?.orderItems?.length} sản phẩm)
                </Checkbox>
              </Col>
              <Col style={{textAlign: 'center'}} className='col header-price' span={4}>Đơn giá</Col>
              <Col style={{textAlign: 'center'}} className='col header-quantity' span={4}>Số lượng</Col>
              <Col style={{textAlign: 'center'}} className='col header-money'span={4}>Thành tiền</Col>
              <Col span={2} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <DeleteOutlined style={{color: 'red', cursor: 'pointer'}} onClick={handleRemoveAllOder}/>
              </Col>
            </Row>
            <Divider />

            {
              order?.orderItems?.map((order)=>{
                  return (
            <Row className="cart-item" align="middle">
              <Col span={10} className="cart-product" style={{display: 'flex', alignItems: 'center', justifyContent: 'start'}} >
                <Checkbox 
                onChange={onChange} value={order?.product}
                checked= {listChecked.includes(order?.product)}
                ></Checkbox>
                <img
                  src={order?.image}
                  alt="product"
                  className="product-image"
                />
                <span>{order?.name}</span>
              </Col>
              <Col style={{textAlign:'center'}} span={4}>
                <span className="price-original" style={{color: 'red', textDecoration:'underline'}}>{ converPeice(order?.price)}</span>
              </Col>
              <Col  span={4}>
                <div className="quantity-controls">
                  <Button style={{ border: 'none',borderRadius: '0', borderRight: 'solid 1px #ccc'}} onClick={()=>handleChangeCount('decrease',order?.product)}  disabled={order?.amount <= 1} >-</Button>
                  <InputNumber controls={false}
                   className="custom-input-number"
                   style={{ borderRadius: '0',height: '30px',border: 'none'}} 
                   value={order?.amount} />
                  <Button style={{ border: 'none',borderRadius: '0',borderLeft: 'solid 1px #ccc'}} onClick={()=>handleChangeCount('increase',order?.product)}>+</Button>
                </div>
              </Col>
              <Col span={4}>
                <span style={{color: 'red', fontWeight: 'bold'}} className="total-price">{converPeice(order?.price * order?.amount)}</span>
              </Col>
              <Col span={2}>
                <DeleteOutlined 
                style={{ color: 'red', cursor: 'pointer',display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={()=>handleDeleteOrder(order?.product)}
                 />
              </Col>
            </Row>
                  )
              })
            }
            
          </div>
            
          <div className="cart-summary">
            <div style={{fontSize: '16px', fontWeight: 'bold'}}>
              <span style={{marginRight: '10px'}}>Địa chỉ: </span>
              <span style={{color:'blue', textDecoration: 'underline', marginRight: '10px'}}>{`${user?.address} - ${user?.city}`}</span>
              <span style={{cursor: 'pointer'}} onClick={handleOnchangAddress}>Thay đổi</span>
            </div>
            <Divider />

            <div>
              <div className="summary-row">
              <span>Tạm tính</span>
              <span>{converPeice(priceMemo)}</span>
              
            </div>
            <div className="summary-row">
              <span>Giảm giá</span>
              <span>{converPeice(discountMemo)}</span>
            </div>
            <div className="summary-row">
              <span>Phí giao hàng</span>
              <span>{converPeice(diliveryMemo)}</span>
            </div>
            <Divider />
            <div className="summary-row total">
              <span>Tổng tiền</span>
              <span className="summary-total">{converPeice(totalPrice)}</span>
            </div>
            <p className="vat-text">(Đã bao gồm VAT nếu có)</p>
            <Button type="primary" danger block size="large"
            onClick = {handleAddCard}>
              Mua hàng
            </Button>
            </div>
          </div>
            
        </div>
        <ModalComponent
            title="Cập nhật thông tin giao hàng"
            open={isModalOpenUpdateInfor}
            onCancel={handleCancelUpdate}
            onOk={handleUpdateInforUser}
        >
          <Loading isPending={isPending}>
              <Form
            name="basic"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            form={form}
        >
            <Form.Item
                label="Name"
                name="name"
                rules={[
                    {
                        required: true,
                        message: 'Please input your name!',
                    },
                ]}
            >
                <Input
                    value={stateUserDetails?.name}
                    onChange={handleOnchangDetails}
                    name="name"
                />
            </Form.Item>
            <Form.Item
                label="City"
                name="city"
                rules={[
                    {
                        required: true,
                        message: 'Please input your city!',
                    },
                ]}
            >
                <Input
                    value={stateUserDetails?.city}
                    onChange={handleOnchangDetails}
                    name="city"
                />
            </Form.Item>
            <Form.Item
                label="Phone"
                name="phone"
                rules={[
                    {
                        required: true,
                        message:
                            'Please input your count phone!',
                    },
                ]}
            >
                <Input
                    value={stateUserDetails?.phone}
                    onChange={handleOnchangDetails}
                    name="phone"
                />
            </Form.Item>
            <Form.Item
                label="Address"
                name="address"
                rules={[
                    {
                        required: true,
                        message:
                            'Please input your address!',
                    },
                ]}
            >
                <Input
                    value={stateUserDetails?.address}
                    onChange={handleOnchangDetails}
                    name="address"
                />
            </Form.Item>
        </Form>
          </Loading>
            
        </ModalComponent>
    </div>
    
  )
}

export default OrderPage