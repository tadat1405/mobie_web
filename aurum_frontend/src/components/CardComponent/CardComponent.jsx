import React from 'react'
import { useNavigate } from 'react-router-dom'
import { converPeice } from '../../../utils'

const CardComponent = (props) => {
   const { image, hoverImage, name, brand, price, discount, selled, id, oldPrice, countInStock } = props
   const nagivate = useNavigate();

  return (
    <div
      onClick={()=>nagivate(`/product-details/${id}`)}
      className='group relative cursor-pointer text-center'
    >
      {discount > 0 && (
        <span className='absolute left-3 top-3 z-10 rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-bold text-white'>-{discount}%</span>
      )}
      {countInStock === 0 && (
        <span className='absolute right-3 top-3 z-10 rounded-full bg-slate-700 px-2.5 py-0.5 text-xs font-medium text-white'>Hết hàng</span>
      )}
      <div className='relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-b from-brand-50 to-white shadow-sm ring-1 ring-brand-100/70 transition duration-500 group-hover:shadow-xl group-hover:shadow-brand-500/20'>
        <img src={image} alt={name} loading='lazy' className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`} />
        {hoverImage && <img src={hoverImage} alt={name} loading='lazy' className='absolute inset-0 h-full w-full object-cover opacity-0 transition duration-700 group-hover:opacity-100' />}
      </div>
      <div className='px-1 pt-4'>
        {brand && <div className='text-[11px] font-bold uppercase tracking-[0.2em] text-slate-800'>{brand}</div>}
        <h3 className='mt-1 min-h-10 text-[13px] leading-snug text-slate-600 line-clamp-2 transition group-hover:text-brand-600'>{name}</h3>
        <div className='mt-2 text-lg font-semibold text-brand-600'>{converPeice(price)}</div>
        <div className='h-4 text-xs text-slate-400 line-through'>{oldPrice ? converPeice(oldPrice) : ''}</div>
        <div className='mt-1 text-xs text-slate-400'>{selled ?? 0} đã bán</div>
      </div>
    </div>
  )
}

export default CardComponent
