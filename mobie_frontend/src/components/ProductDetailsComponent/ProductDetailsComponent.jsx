import { Button, Col, Image, Rate, Row } from 'antd'
import React, { useState } from 'react';
import imageProductSmall1 from '../../assets/images/phonemall1.jpg';
import imageProductSmall2 from '../../assets/images/phonemall2.jpg';
import './ProductDetailsComponent.scss';
import { MinusOutlined, PlusOutlined, StarFilled } from '@ant-design/icons';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import * as ProductService from '../../services/ProductService';
import { useQuery } from '@tanstack/react-query';
import Loading from '../LoadingComponent/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { addOrderProduct } from '../../redux/slice/orderSlide';
import { converPeice } from '../../../utils';


const ProductDetailsComponent = ({idProduct}) => {
    const [numProduct, setNumProduct] = useState(1)
    const user = useSelector((state)=>state.user);
    const nagivate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch()    

    const fetchDetailsProduct = async (context) => {
            const id = context?.queryKey && context?.queryKey[1]
            if(id){
                const res = await ProductService.getDetailsProduct(id);
            return res.data
            }
        };

    const {data: productsDetails, isFetching} = useQuery ({ 
        queryKey: ['products-details',idProduct], 
        queryFn: fetchDetailsProduct, 
        enabled: !!idProduct
    });
         const onChang = (e)=>{
                setNumProduct(Number(e.target.value))
         }
         const handleChangCount = (type) => {
            if (type === "decrease") {
                setNumProduct((prev) => (prev > 1 ? prev - 1 : 1));
            } else if (type === "increase") {
                setNumProduct((prev) => prev + 1);
            }
        };
        const handleAddOderProduct = ()=>{
            if(!user?.id){
                nagivate('/sign-in', {state: location?.pathname})
            }
            else{
                //  name: {type: String, required: true},
                // amount: {type: Number, required: true},
                // image: {type: String, required: true},
                // price: {type: Number, required: true},
                // product: {
                //     type: mongoose.Schema.Types.ObjectId,
                //     ref: "Product",
                //     required: true,

                dispatch(addOrderProduct({
                    orderItem: {
                        name: productsDetails?.name,
                        amount: numProduct,
                        image: productsDetails?.image,
                        price: productsDetails?.price,
                        product: productsDetails?._id,
                        discount: productsDetails?.discount
                    }
                }))
            }
        }
        console.log("prodcutDetail", productsDetails)
        console.log("userrr", user)
  return (
    <div>
        <Loading isPending={isFetching}>
            <Row style={{padding: '16px', background: '#fff',  height: '500px'}}>
            <Col span={10} >
                <div style={{borderRight: '1px solid #ccc', marginRight: '10px'}}>
                    <div className='card-image'>
                        <Image src={productsDetails?.image} alt='image product'  preview={true}  />
                    </div>
                <Row style={{paddingTop: '10px'}}  gutter={5} >
                    <Col span={4}>
                        <Image  src={imageProductSmall1} alt='image small' preview={true} />
                     </Col>
                    <Col span={4}>
                        <Image  src={imageProductSmall2} alt='image small' preview={true} />
                    </Col>
                    <Col span={4}>
                        <Image  src={imageProductSmall1} alt='image small' preview={true} />
                     </Col>
                    <Col span={4}>
                        <Image  src={imageProductSmall2} alt='image small' preview={true} />
                    </Col>
                    <Col span={4}>
                        <Image  src={imageProductSmall1} alt='image small' preview={true} />
                     </Col>
                    <Col span={4}>
                        <Image  src={imageProductSmall2} alt='image small' preview={true} />
                    </Col>
                </Row>
                </div>
            </Col>
            <Col span={14}>
                <Col span={14}>
                <div className="product-info">
                    <div className="name_product">{productsDetails?.name}</div>

                    <div className="rating-stock">
                    
                    <Rate allowHalf value={productsDetails?.rating >5 ? 5 : productsDetails?.rating }/>

                    <span className="text_product">| Còn hàng:  {productsDetails?.countInStock}</span>
                    </div>

                    <div className="price_product">
                    <span>{ converPeice(productsDetails?.price)}</span>
                    </div>

                    <div className="address">
                    <span>Giao đến </span>
                    <span className="address_product">{user?.address}</span> -
                    <span className="change_address"> Đổi địa chỉ </span>
                    </div>

                    <div className="quantity">
                    <span>Số lượng</span>
                    <div className="quantity_product">
                        <Button onClick={()=>handleChangCount("decrease")}><MinusOutlined /></Button>
                        <input type="number" onChange={onChang}  value={numProduct} />
                        <Button onClick={()=>handleChangCount("increase")}><PlusOutlined /></Button>
                    </div>
                    </div>

                    <div className="btn">
                    <Button className="btn-buy pay" onClick={handleAddOderProduct} >Chọn mua</Button>
                    <Button className="btn-buy later">Mua trả sau</Button>
                    </div>
                </div>
                </Col>
            </Col>
        </Row>
        </Loading>
        
    </div>
  )
}

export default ProductDetailsComponent