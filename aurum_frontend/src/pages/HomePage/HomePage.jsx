import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import CardComponent from '../../components/CardComponent/CardComponent';
import { useQuery } from '@tanstack/react-query';
import * as ProductService from '../../services/ProductService'
import { useSelector } from 'react-redux';
import { useDebounce } from '../../hooks/useDebounce';
import { converPeice } from '../../../utils';
import { CarOutlined, SafetyCertificateOutlined, SyncOutlined, CreditCardOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { sortTypes, toTypePath } from '../../constants/categories';

const PERKS = [
  { icon: <CarOutlined />, title: 'Miễn phí giao hàng', desc: 'Toàn quốc, nhanh từ 2 giờ' },
  { icon: <SafetyCertificateOutlined />, title: 'Bảo hành trọn đời', desc: 'Làm sạch, đánh bóng miễn phí' },
  { icon: <SyncOutlined />, title: 'Đổi miễn phí 72 giờ', desc: 'Đổi size, đổi mẫu dễ dàng' },
  { icon: <CreditCardOutlined />, title: 'Trả góp 0%', desc: 'Duyệt nhanh, thủ tục gọn' },
]

const ProductCard = (product) => (
  <CardComponent
    key={product._id}
    countInStock={product.countInStock}
    image={product.image}
    hoverImage={product.images?.[0]}
    name={product.name}
    brand={product.brand}
    price={product.price}
    discount={product.discount}
    oldPrice={product.oldPrice}
    selled={product.selled}
    id={product._id}
  />
)

const useTypeProducts = (type, limit) => useQuery({
  queryKey: ['home-type', type, limit],
  queryFn: () => ProductService.getProductType(type, 0, limit),
  staleTime: 5 * 60 * 1000,
})

const CategoryCircle = ({ type }) => {
  const nagivate = useNavigate()
  const { data } = useTypeProducts(type, 10)
  const first = data?.data?.[0]
  return (
    <button type='button' onClick={() => nagivate(toTypePath(type), { state: type })} className='group flex w-32 flex-col items-center gap-3'>
      <span className='block h-28 w-28 overflow-hidden rounded-full bg-brand-50 ring-4 ring-brand-100 transition duration-500 group-hover:ring-brand-500'>
        {first && <img src={first.image} alt={type} className='h-full w-full object-cover transition duration-700 group-hover:scale-110' />}
      </span>
      <span className='text-center text-sm font-semibold leading-tight text-slate-700 group-hover:text-brand-600'>{type}</span>
    </button>
  )
}

const TypeSection = ({ type }) => {
  const nagivate = useNavigate()
  const { data } = useTypeProducts(type, 10)
  const list = data?.data || []
  if (!list.length) return null
  return (
    <section className='mt-20'>
      <div className='mb-10 text-center'>
        <h2 className='text-3xl font-bold text-brand-600'>{type}</h2>
        <div className='mx-auto mt-3 h-0.5 w-16 rounded bg-brand-500' />
      </div>
      <div className='grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        {list.map(ProductCard)}
      </div>
      <div className='mt-10 text-center'>
        <button type='button' onClick={() => nagivate(toTypePath(type), { state: type })}
          className='inline-flex items-center gap-2 rounded-full border border-brand-500 px-7 py-2.5 text-sm font-semibold text-brand-600 transition hover:bg-brand-600 hover:text-white'>
          Xem tất cả <ArrowRightOutlined />
        </button>
      </div>
    </section>
  )
}

const Hero = ({ featured }) => {
  const nagivate = useNavigate()
  return (
    <section className='relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-100 via-brand-50 to-white'>
      <div className='absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl' />
      <div className='absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-rose-200/50 blur-3xl' />
      <div className='relative grid items-center gap-10 px-8 py-12 lg:grid-cols-2 lg:px-16 lg:py-16'>
        <div>
          <span className='inline-block rounded-full bg-white/80 px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-brand-600'>Bộ sưu tập mới</span>
          <h1 className='mt-5 text-4xl font-extrabold leading-tight text-slate-800 lg:text-5xl'>
            Tình yêu nở hoa<br /><span className='text-brand-600'>trong từng đường nét</span>
          </h1>
          <p className='mt-5 max-w-md leading-relaxed text-slate-600'>Nhẫn cưới, nhẫn cầu hôn, dây chuyền, bông tai từ vàng 10K, 14K, 18K, 24K và bạc 925 — dịu dàng, tinh xảo, dành cho khoảnh khắc đáng nhớ nhất.</p>
          <div className='mt-8 flex flex-wrap gap-3'>
            <button type='button' onClick={() => nagivate(toTypePath('Nhẫn cưới'), { state: 'Nhẫn cưới' })}
              className='rounded-full bg-brand-600 px-8 py-3 font-bold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700'>Khám phá nhẫn cưới</button>
            <button type='button' onClick={() => nagivate(toTypePath('Nhẫn cầu hôn'), { state: 'Nhẫn cầu hôn' })}
              className='rounded-full border border-brand-500 bg-white/60 px-8 py-3 font-semibold text-brand-600 transition hover:bg-white'>Nhẫn cầu hôn</button>
          </div>
        </div>
        <div className='hidden grid-cols-3 gap-5 lg:grid'>
          {featured.slice(0, 3).map((p, i) => (
            <button type='button' key={p._id} onClick={() => nagivate(`/product-details/${p._id}`)}
              className={`rounded-3xl bg-white p-3 text-left shadow-xl shadow-brand-500/10 transition hover:-translate-y-2 ${i === 1 ? 'mt-10' : ''}`}>
              <div className='aspect-square overflow-hidden rounded-2xl bg-brand-50'>
                <img src={p.image} alt={p.name} className='h-full w-full object-cover' />
              </div>
              <div className='mt-3 line-clamp-2 min-h-8 text-xs leading-snug text-slate-600'>{p.name}</div>
              <div className='mt-1 text-sm font-bold text-brand-600'>{converPeice(p.price)}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

const HomePage = () => {
  const searchProduct = useSelector((state)=>state?.product?.search)
  const searchDebounce = useDebounce(searchProduct,500)
  const [limit, setLimit] = useState(10)

  const { data: typesRes } = useQuery({ queryKey: ['all-types'], queryFn: ProductService.getAllTypeProduct, staleTime: 10 * 60 * 1000 })
  const types = sortTypes(typesRes?.data || [])

  const { data: featuredRes } = useTypeProducts('Nhẫn cầu hôn', 10)
  const featured = [...(featuredRes?.data || [])].sort((a, b) => b.price - a.price)

  const { data: searchRes, isFetching } = useQuery({
    queryKey: ['products-search', limit, searchDebounce],
    queryFn: () => ProductService.getAllProduct(searchDebounce, limit),
    enabled: !!searchDebounce,
    placeholderData: (prev) => prev,
  })
  const results = searchRes?.data || []

  return (
    <div className='mx-auto max-w-[1400px] px-6 py-6'>
      {searchDebounce ? (
        <>
          <h2 className='mb-8 text-center text-3xl font-bold text-brand-600'>Kết quả cho &quot;{searchDebounce}&quot;</h2>
          <div className='grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>{results.map(ProductCard)}</div>
          {!isFetching && results.length === 0 && <div className='py-16 text-center text-slate-500'>Không tìm thấy sản phẩm phù hợp.</div>}
          {results.length >= limit && (
            <div className='mt-10 text-center'>
              <button disabled={isFetching} onClick={()=>setLimit((p)=>p+10)}
                className='rounded-full bg-brand-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 hover:bg-brand-700 disabled:opacity-60'>
                {isFetching ? 'Đang tải...' : 'Xem thêm sản phẩm'}
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <Hero featured={featured} />

          <div className='mt-14 flex flex-wrap justify-center gap-x-8 gap-y-8'>
            {types.map((t) => <CategoryCircle key={t} type={t} />)}
          </div>

          {types.map((t) => <TypeSection key={t} type={t} />)}

          <div className='mt-24 grid grid-cols-2 gap-6 rounded-3xl bg-brand-50 px-6 py-10 lg:grid-cols-4'>
            {PERKS.map((p)=>(
              <div key={p.title} className='flex flex-col items-center gap-2 text-center'>
                <span className='grid h-14 w-14 place-items-center rounded-full bg-white text-2xl text-brand-600 shadow-sm'>{p.icon}</span>
                <div className='font-bold text-slate-800'>{p.title}</div>
                <div className='text-xs text-slate-500'>{p.desc}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default HomePage
