import React from 'react'
import { useNavigate } from 'react-router-dom'

const TypeProduct = ({name}) => {
  const nagivate = useNavigate();
  const handleNagivateType = (type)=>{
    nagivate(`/product/${type.normalize('NFD').replace(/[̀-ͯ]/g,'')?.replace(/ /g, '_')}`,{state: type})
  }
  return (
    <button
      type='button'
      onClick={()=>handleNagivateType(name)}
      className='shrink-0 rounded-full bg-white px-5 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 shadow-sm transition hover:bg-brand-600 hover:text-white hover:ring-brand-600'
    >
      {name}
    </button>
  )
}

export default TypeProduct
