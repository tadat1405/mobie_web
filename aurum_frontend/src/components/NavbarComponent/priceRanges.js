export const PRICE_RANGES = [
    { value: 'all', label: 'Tất cả mức giá' },
    { value: '0-3', label: 'Dưới 3 triệu', min: 0, max: 3e6 },
    { value: '3-7', label: '3 - 7 triệu', min: 3e6, max: 7e6 },
    { value: '7-15', label: '7 - 15 triệu', min: 7e6, max: 15e6 },
    { value: '15-30', label: '15 - 30 triệu', min: 15e6, max: 30e6 },
    { value: '30-', label: 'Trên 30 triệu', min: 30e6, max: Infinity },
]
