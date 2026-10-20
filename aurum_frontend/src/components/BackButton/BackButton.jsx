import React from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const BackButton = ({ className = '' }) => {
  const nagivate = useNavigate()
  return (
    <button
      type='button'
      onClick={() => nagivate(-1)}
      className={`inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-slate-600 ring-1 ring-brand-100 transition hover:bg-brand-600 hover:text-white hover:ring-brand-600 ${className}`}
    >
      <ArrowLeftOutlined /> Quay lại
    </button>
  )
}

export default BackButton
