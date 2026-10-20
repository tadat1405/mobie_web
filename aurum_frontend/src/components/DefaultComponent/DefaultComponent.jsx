import React from 'react'
import { BRAND } from '../../brand'
import HeaderComponent from '../HeaderComponent/HeaderComponent'

const DefaultComponent = ({children}) => {
  return (
    <div className='min-h-screen flex flex-col'>
      <HeaderComponent/>
      <main className='flex-1'>{children}</main>
      <footer className='mt-16 bg-gradient-to-b from-brand-50 to-brand-100/70 text-slate-600'>
        <div className='mx-auto grid max-w-[1400px] gap-8 px-6 py-12 text-sm md:grid-cols-4'>
          <div>
            <div className='text-2xl font-bold text-brand-600'>{BRAND.name}</div>
            <div className='mt-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-brand-500'>{BRAND.slogan}</div>
            <p className='mt-4 leading-relaxed'>Trang sức vàng 10K, 14K, 18K, 24K và bạc 925 chế tác tinh xảo. Bảo hành trọn đời, miễn phí giao hàng toàn quốc.</p>
          </div>
          <div>
            <div className='mb-3 font-semibold text-slate-800'>Hỗ trợ khách hàng</div>
            <ul className='space-y-2'><li>Hotline: {BRAND.hotline}</li><li>Chính sách thu đổi</li><li>Bảo hành trọn đời</li><li>Hướng dẫn đo size nhẫn</li></ul>
          </div>
          <div>
            <div className='mb-3 font-semibold text-slate-800'>Danh mục</div>
            <ul className='space-y-2'><li>Nhẫn cưới</li><li>Nhẫn cầu hôn</li><li>Dây chuyền &amp; Mặt dây</li><li>Bông tai</li><li>Lắc &amp; Vòng tay</li></ul>
          </div>
          <div>
            <div className='mb-3 font-semibold text-slate-800'>Cửa hàng</div>
            <ul className='space-y-2'><li>{BRAND.address}</li><li>Thanh toán khi nhận hàng</li><li>PayPal</li><li>Trả góp 0%</li></ul>
          </div>
        </div>
        <div className='border-t border-brand-100 py-4 text-center text-xs text-slate-500'>© 2026 {BRAND.name}. Dữ liệu sản phẩm mang tính minh họa.</div>
      </footer>
    </div>
  )
}

export default DefaultComponent
