export const TYPE_ICON = {
  'Nhẫn cưới': '💍',
  'Nhẫn cầu hôn': '💎',
  'Nhẫn thời trang': '✨',
  'Bộ trang sức': '👑',
  'Dây chuyền & Mặt dây': '📿',
  'Bông tai': '🌸',
  'Lắc & Vòng tay': '🔗',
  'Charm & Phụ kiện': '🎀',
}

export const TYPE_ORDER = [
  'Nhẫn cưới', 'Nhẫn cầu hôn', 'Bộ trang sức', 'Dây chuyền & Mặt dây',
  'Bông tai', 'Lắc & Vòng tay', 'Nhẫn thời trang', 'Charm & Phụ kiện',
]

export const sortTypes = (types = []) =>
  [...types].sort((a, b) => TYPE_ORDER.indexOf(a) - TYPE_ORDER.indexOf(b))

export const toTypePath = (type) =>
  `/product/${type.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ /g, '_')}`
