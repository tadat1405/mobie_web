// Gửi sự kiện thương mại điện tử vào dataLayer cho thẻ HT (xem index.html).
// Luôn push HAI lần riêng: xóa ecommerce cũ rồi mới đẩy sự kiện mới.

export const trackEcommerce = (event, ecommerce) => {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ ecommerce: null })
  window.dataLayer.push({ event, ecommerce })
}

// Chuyển một sản phẩm / dòng giỏ hàng của web này sang định dạng item của dataLayer
export const toTrackItem = (line, quantity = line?.amount ?? 1) => ({
  item_id: line?._id ?? line?.product,
  item_name: line?.name,
  item_category: line?.category,
  price: line?.price,
  quantity,
})
