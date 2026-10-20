import { Rate } from 'antd'
import React, { useEffect, useState } from 'react';
import { MinusOutlined, PlusOutlined, ShoppingCartOutlined, ThunderboltOutlined, CheckCircleFilled } from '@ant-design/icons';
import * as ProductService from '../../services/ProductService';
import { useQuery } from '@tanstack/react-query';
import Loading from '../LoadingComponent/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { addOrderProduct } from '../../redux/slice/orderSlide';
import { converPeice } from '../../../utils';
import { toast } from 'react-toastify';
import { trackEcommerce, toTrackItem } from '../../utils/tracking';
import RelatedProducts from '../RelatedProducts/RelatedProducts';

const Section = ({ title, children }) => (
    <section className='mt-6 rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-sm'>
        <h3 className='mb-4 text-lg font-bold text-slate-900'>{title}</h3>
        {children}
    </section>
)

const ProductDetailsComponent = ({idProduct}) => {
    const [numProduct, setNumProduct] = useState(1)
    const [activeImage, setActiveImage] = useState(null)
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

    // Sự kiện view_item: khi đã có dữ liệu sản phẩm
    useEffect(() => {
        if (!productsDetails?._id) return
        trackEcommerce('view_item', {
            currency: 'VND',
            value: productsDetails.price,
            items: [toTrackItem(productsDetails, 1)],
        })
    }, [productsDetails?._id, productsDetails?.name, productsDetails?.category, productsDetails?.price])

    const maxStock = productsDetails?.countInStock || 1
    const handleChangCount = (type) => {
        setNumProduct((prev) => type === 'decrease' ? Math.max(1, prev - 1) : Math.min(maxStock, prev + 1));
    };

    const addToCart = ()=>{
        if(!user?.id){
            nagivate('/sign-in', {state: location?.pathname})
            return false
        }
        dispatch(addOrderProduct({
            orderItem: {
                name: productsDetails?.name,
                amount: numProduct,
                image: productsDetails?.image,
                price: productsDetails?.price,
                product: productsDetails?._id,
                discount: productsDetails?.discount,
                category: productsDetails?.category
            }
        }))
        trackEcommerce('add_to_cart', {
            currency: 'VND',
            value: productsDetails?.price * numProduct,
            items: [toTrackItem(productsDetails, numProduct)],
        })
        return true
    }
    const handleAddToCart = ()=>{ if(addToCart()) toast.success('Đã thêm vào giỏ hàng') }
    const handleBuyNow = ()=>{ if(addToCart()) nagivate('/order') }

    const images = [productsDetails?.image, ...(productsDetails?.images || [])].filter(Boolean).slice(0, 8)
    const currentImage = activeImage || productsDetails?.image
    const specs = productsDetails?.specs ? Object.entries(productsDetails.specs) : []
    const saved = productsDetails?.oldPrice ? productsDetails.oldPrice - productsDetails.price : 0

    return (
        <Loading isPending={isFetching}>
            <div className='grid gap-8 rounded-3xl bg-white p-6 ring-1 ring-brand-100 shadow-sm lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]'>
                <div>
                    <div className='grid aspect-square place-items-center overflow-hidden rounded-2xl bg-stone-50'>
                        <img src={currentImage} alt={productsDetails?.name} className='h-full w-full object-cover' />
                    </div>
                    <div className='mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6'>
                        {images.map((img) => (
                            <button
                                type='button'
                                key={img}
                                onClick={()=>setActiveImage(img)}
                                className={`aspect-square overflow-hidden rounded-xl bg-slate-50 p-1 ring-2 transition ${currentImage === img ? 'ring-brand-600' : 'ring-transparent hover:ring-slate-300'}`}
                            >
                                <img src={img} alt='ảnh nhỏ' className='h-full w-full object-contain' />
                            </button>
                        ))}
                    </div>
                </div>

                <div className='flex flex-col gap-5'>
                    <div>
                        <div className='flex flex-wrap gap-2'>
                            {productsDetails?.brand && <span className='rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700'>Bộ sưu tập {productsDetails.brand}</span>}
                            {productsDetails?.material && <span className='rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700'>{productsDetails.material}</span>}
                        </div>
                        <h1 className='mt-3 text-2xl font-bold leading-snug text-slate-800'>{productsDetails?.name}</h1>
                        <div className='mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500'>
                            <Rate allowHalf disabled value={Math.min(productsDetails?.rating || 0, 5)} style={{fontSize: 16}} />
                            <span className='font-medium text-slate-700'>{productsDetails?.rating}</span>
                            <span className='text-slate-300'>|</span>
                            <span>Đã bán {productsDetails?.selled ?? 0}</span>
                            <span className='text-slate-300'>|</span>
                            <span className='inline-flex items-center gap-1 text-emerald-600'><CheckCircleFilled /> Còn {productsDetails?.countInStock} sản phẩm</span>
                        </div>
                    </div>

                    <div className='rounded-2xl bg-gradient-to-r from-brand-50 to-white p-5'>
                        <div className='flex flex-wrap items-end gap-3'>
                            <span className='text-3xl font-extrabold text-brand-700'>{converPeice(productsDetails?.price)}</span>
                            {productsDetails?.oldPrice ? <span className='pb-1 text-base text-slate-400 line-through'>{converPeice(productsDetails.oldPrice)}</span> : null}
                            {productsDetails?.discount ? <span className='mb-1 rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-bold text-white'>-{productsDetails.discount}%</span> : null}
                        </div>
                        {saved > 0 && <div className='mt-1 text-sm text-slate-600'>Tiết kiệm {converPeice(saved)}</div>}
                    </div>

                    <div className='text-sm text-slate-600'>
                        Giao đến <span className='font-medium text-slate-900 underline decoration-dotted'>{user?.address || 'chưa có địa chỉ'}</span>
                        <button type='button' className='ml-2 text-brand-600 hover:underline' onClick={()=>nagivate('/profile-user')}>Đổi địa chỉ</button>
                    </div>

                    <div>
                        <div className='mb-2 text-sm font-medium text-slate-700'>Số lượng</div>
                        <div className='inline-flex items-center overflow-hidden rounded-xl ring-1 ring-slate-300'>
                            <button type='button' onClick={()=>handleChangCount('decrease')} className='grid h-10 w-10 place-items-center hover:bg-slate-100'><MinusOutlined /></button>
                            <input
                                type='number'
                                value={numProduct}
                                onChange={(e)=>setNumProduct(Math.min(maxStock, Math.max(1, Number(e.target.value) || 1)))}
                                className='h-10 w-14 border-x border-slate-200 text-center outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none'
                            />
                            <button type='button' onClick={()=>handleChangCount('increase')} className='grid h-10 w-10 place-items-center hover:bg-slate-100'><PlusOutlined /></button>
                        </div>
                    </div>

                    <div className='flex flex-wrap gap-3'>
                        <button type='button' onClick={handleBuyNow} className='flex min-w-44 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700'>
                            <ThunderboltOutlined /> Mua ngay
                        </button>
                        <button type='button' onClick={handleAddToCart} className='flex min-w-44 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-brand-600 px-6 py-3.5 font-semibold text-brand-600 transition hover:bg-brand-50'>
                            <ShoppingCartOutlined /> Thêm vào giỏ
                        </button>
                    </div>

                    <ul className='grid gap-2 text-sm text-slate-600 sm:grid-cols-2'>
                        <li className='flex items-center gap-2'><CheckCircleFilled className='text-emerald-500' /> Bảo hành trọn đời</li>
                        <li className='flex items-center gap-2'><CheckCircleFilled className='text-emerald-500' /> Đổi miễn phí trong 72 giờ</li>
                        <li className='flex items-center gap-2'><CheckCircleFilled className='text-emerald-500' /> Miễn phí giao hàng toàn quốc</li>
                        <li className='flex items-center gap-2'><CheckCircleFilled className='text-emerald-500' /> Hỗ trợ trả góp 0%</li>
                    </ul>
                </div>
            </div>

            {specs.length > 0 && (
                <Section title='Thông số kỹ thuật'>
                    <table className='w-full text-sm'>
                        <tbody>
                            {specs.map(([k, v]) => (
                                <tr key={k} className='odd:bg-slate-50'>
                                    <td className='w-1/3 px-4 py-2.5 font-medium text-slate-500 align-top'>{k}</td>
                                    <td className='px-4 py-2.5 text-slate-800'>{v}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Section>
            )}

            {productsDetails?.description && (
                <Section title='Mô tả sản phẩm'>
                    <p className='leading-relaxed text-slate-700'>{productsDetails.description}</p>
                    {productsDetails?.sourceUrl && (
                        <a href={productsDetails.sourceUrl} target='_blank' rel='noreferrer' className='mt-3 inline-block text-sm text-brand-600 hover:underline'>Nguồn tham khảo</a>
                    )}
                </Section>
            )}

            {productsDetails && <RelatedProducts product={productsDetails} />}
        </Loading>
    )
}

export default ProductDetailsComponent
