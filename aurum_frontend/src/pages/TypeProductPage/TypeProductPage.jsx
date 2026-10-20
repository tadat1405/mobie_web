import React, { useEffect, useMemo, useState } from 'react'
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'
import { PRICE_RANGES } from '../../components/NavbarComponent/priceRanges'
import CardComponent from '../../components/CardComponent/CardComponent'
import { Empty, Pagination } from 'antd'
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toTypePath } from '../../constants/categories';
import * as ProductService from '../../services/ProductService';
import Loading from '../../components/LoadingComponent/Loading';
import BackButton from '../../components/BackButton/BackButton';
import { useSelector } from 'react-redux';
import { useDebounce } from '../../hooks/useDebounce';

const PAGE_SIZE = 12
const DEFAULT_FILTERS = { brands: [], materials: [], price: 'all', rating: 0 }

const countBy = (list, key) => {
  const map = {}
  list.forEach((p)=>{ if(p[key]) map[p[key]] = (map[p[key]] || 0) + 1 })
  return Object.entries(map).map(([name, count])=>({name, count})).sort((a,b)=>b.count-a.count)
}

const TypeProductPage = () => {
  const location = useLocation();
  const { data: typesRes } = useQuery({ queryKey: ['all-types'], queryFn: ProductService.getAllTypeProduct, staleTime: 10 * 60 * 1000 })
  // Vào thẳng bằng URL (F5 / chia sẻ link) thì không có state: suy ra loại từ đường dẫn
  const state = location.state || (typesRes?.data || []).find((t) => toTypePath(t) === decodeURIComponent(location.pathname))
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [sort, setSort] = useState('default')
  const [page, setPage] = useState(1)
  const searchProduct = useSelector((state)=>state?.product?.search)
  const searchDebounce = useDebounce(searchProduct,500)

  useEffect(()=>{
    if(!state) return
    setLoading(true)
    setFilters(DEFAULT_FILTERS)
    setPage(1)
    ProductService.getProductType(state, 0, 1000)
      .then((res)=>{ if(res?.status === 'OK') setProducts(res.data) })
      .catch((err)=>console.error(err))
      .finally(()=>setLoading(false))
  },[state])

  const brands = useMemo(()=>countBy(products, 'brand'),[products])
  const materials = useMemo(()=>countBy(products, 'material'),[products])

  const filtered = useMemo(()=>{
    const range = PRICE_RANGES.find((r)=>r.value === filters.price)
    const keyword = (searchDebounce || '').toLowerCase()
    const list = products.filter((p)=>
      (!keyword || p.name?.toLowerCase().includes(keyword)) &&
      (!filters.brands.length || filters.brands.includes(p.brand)) &&
      (!filters.materials.length || filters.materials.includes(p.material)) &&
      (!range?.max || (p.price >= range.min && p.price < range.max)) &&
      (!filters.rating || p.rating >= filters.rating))
    if(sort === 'asc') list.sort((a,b)=>a.price-b.price)
    if(sort === 'desc') list.sort((a,b)=>b.price-a.price)
    if(sort === 'sold') list.sort((a,b)=>(b.selled||0)-(a.selled||0))
    return list
  },[products, filters, sort, searchDebounce])

  useEffect(()=>{ setPage(1) },[filters, sort, searchDebounce])

  const visible = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE)

  return (
    <Loading isPending={loading}>
      <div className='mx-auto min-h-[70vh] max-w-[1400px] px-6 py-6'>
        <div className='mb-6 flex items-center gap-4'>
          <BackButton />
        </div>
        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-bold text-brand-600'>{state}</h1>
          <div className='mx-auto mt-3 h-0.5 w-16 rounded bg-brand-500' />
        </div>

        <NavbarComponent
          brands={brands} materials={materials} filters={filters} onChange={setFilters}
          onReset={()=>setFilters(DEFAULT_FILTERS)} sort={sort} onSort={setSort} total={filtered.length}
        />

        <div className='mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 xl:grid-cols-4'>
          {visible.map((product)=>(
            <CardComponent
              key={product._id}
              countInStock= {product.countInStock}
              image = {product.image}
              hoverImage = {product.images?.[0]}
              name = {product.name}
              brand = {product.brand}
              price = {product.price}
              discount = {product.discount}
              oldPrice = {product.oldPrice}
              selled = {product.selled}
              id = {product._id}
            />
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className='py-20'><Empty description='Không có sản phẩm phù hợp' /></div>
        )}

        {filtered.length > PAGE_SIZE && (
          <Pagination
            className='!mt-12 !flex !justify-center'
            current={page}
            pageSize={PAGE_SIZE}
            total={filtered.length}
            showSizeChanger={false}
            onChange={(p)=>{ setPage(p); window.scrollTo({top: 0, behavior: 'smooth'}) }}
          />
        )}
      </div>
    </Loading>
  )
}

export default TypeProductPage
