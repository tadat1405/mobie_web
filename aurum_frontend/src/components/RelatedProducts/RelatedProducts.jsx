import React from 'react'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'
import CardComponent from '../CardComponent/CardComponent'

// Gợi ý: cùng loại, ưu tiên cùng thương hiệu và giá gần nhất với sản phẩm đang xem
const RelatedProducts = ({ product, limit = 5 }) => {
    const { data } = useQuery({
        queryKey: ['related-source', product?.type],
        queryFn: () => ProductService.getProductType(product.type, 0, 1000),
        enabled: !!product?.type,
        staleTime: 5 * 60 * 1000,
    })

    const related = (data?.data || [])
        .filter((p) => p._id !== product?._id)
        .map((p) => ({
            p,
            score: (p.brand && p.brand === product?.brand ? 0 : 1e9) + Math.abs(p.price - product?.price),
        }))
        .sort((a, b) => a.score - b.score)
        .slice(0, limit)
        .map((x) => x.p)

    if (!related.length) return null

    return (
        <section className='mt-12'>
            <div className='mb-8 text-center'><h3 className='text-2xl font-bold text-brand-600'>Sản phẩm gợi ý cho bạn</h3><div className='mx-auto mt-3 h-0.5 w-16 rounded bg-brand-500' /></div>
            <div className='grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-5'>
                {related.map((p) => (
                    <CardComponent
                        key={p._id}
                        id={p._id}
                        image={p.image}
                        hoverImage={p.images?.[0]}
                        name={p.name}
                        brand={p.brand}
                        price={p.price}
                        oldPrice={p.oldPrice}
                        discount={p.discount}
                        rating={p.rating}
                        selled={p.selled}
                        countInStock={p.countInStock}
                    />
                ))}
            </div>
        </section>
    )
}

export default RelatedProducts
