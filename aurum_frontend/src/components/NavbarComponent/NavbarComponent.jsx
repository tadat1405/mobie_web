import React from 'react'
import { Select } from 'antd'
import { PRICE_RANGES } from './priceRanges'

const SORTS = [
    { value: 'default', label: 'Sản phẩm mới nhất' },
    { value: 'asc', label: 'Giá thấp đến cao' },
    { value: 'desc', label: 'Giá cao đến thấp' },
    { value: 'sold', label: 'Bán chạy nhất' },
]

const field = 'min-w-36'

// Thanh bộ lọc ngang: Khoảng giá / Chất liệu / Bộ sưu tập / Đánh giá + Sắp xếp
const NavbarComponent = ({ brands = [], materials = [], filters, onChange, onReset, sort, onSort, total }) => {
    const set = (patch) => onChange({ ...filters, ...patch })
    const toOptions = (list) => list.map((x) => ({ value: x.name, label: `${x.name} (${x.count})` }))
    return (
        <div className='flex flex-wrap items-end justify-between gap-4 border-b border-brand-100 pb-5'>
            <div className='flex flex-wrap items-center gap-3'>
                <span className='text-sm font-bold text-slate-800'>Bộ lọc:</span>
                <Select className={field} placeholder='Khoảng giá' allowClear value={filters.price === 'all' ? undefined : filters.price}
                    onChange={(v) => set({ price: v || 'all' })}
                    options={PRICE_RANGES.filter((r) => r.value !== 'all').map((r) => ({ value: r.value, label: r.label }))} />
                {materials.length > 0 && (
                    <Select className={field} mode='multiple' maxTagCount='responsive' placeholder='Chất liệu' value={filters.materials}
                        onChange={(v) => set({ materials: v })} options={toOptions(materials)} />
                )}
                {brands.length > 0 && (
                    <Select className={field} mode='multiple' maxTagCount='responsive' placeholder='Bộ sưu tập' value={filters.brands}
                        onChange={(v) => set({ brands: v })} options={toOptions(brands)} />
                )}
                <Select className={field} placeholder='Đánh giá' allowClear value={filters.rating || undefined}
                    onChange={(v) => set({ rating: v || 0 })}
                    options={[{ value: 5, label: 'Từ 5 sao' }, { value: 4, label: 'Từ 4 sao' }]} />
                <button type='button' onClick={onReset} className='text-xs font-semibold text-brand-600 hover:underline'>Xóa lọc</button>
            </div>
            <div className='flex items-center gap-3'>
                <span className='text-sm text-slate-500'>{total} sản phẩm</span>
                <span className='text-sm font-bold text-slate-800'>Sắp xếp:</span>
                <Select className='min-w-44' value={sort} onChange={onSort} options={SORTS} />
            </div>
        </div>
    )
}

export default NavbarComponent
