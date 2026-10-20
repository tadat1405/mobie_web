// Khám phá collection_id và gom toàn bộ sản phẩm từ huythanhjewelry.vn
// Chạy: node scripts/explore_jewelry.js  -> ghi scripts/data/jewelry_raw.json
const fs = require('fs');
const path = require('path');

const B = 'https://huythanhjewelry.vn';
const UA = { 'User-Agent': 'Mozilla/5.0 (compatible; student-project-crawler)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getText = async (u) => (await fetch(u, { headers: UA })).text();

const PAGES = [
    '/', '/collections/nhan-cau-hon', '/collections/nhan-cuoi', '/collections/day-chuyen',
    '/collections/bong-tai', '/collections/lac-tay', '/collections/lac-chan', '/collections/nhan-24k',
    '/collections/bo-trang-suc', '/collections/charm-vang-24k', '/collections/mat-day-chuyen',
];

(async () => {
    const ids = new Set();
    for (const p of PAGES) {
        const h = await getText(B + p);
        for (const m of h.matchAll(/collection_id\D{1,8}(\d{6,})/g)) ids.add(m[1]);
        console.log(p, '-> ids', ids.size);
        await sleep(400);
    }

    const seen = {};
    const prods = {};
    const queue = [...ids];
    while (queue.length) {
        const id = queue.shift();
        if (id in seen) continue;
        try {
            const r = await fetch(`${B}/api/collections/${id}?page_size=1000`, { headers: UA });
            const j = await r.json();
            const list = j.products || [];
            seen[id] = list.length;
            for (const p of list) {
                prods[p.ID] = p;
                for (const g of p.GR || []) if (!(g in seen)) queue.push(g);
            }
        } catch (e) {
            seen[id] = -1;
        }
        await sleep(300);
    }
    console.log('collections:', seen);
    console.log('unique products:', Object.keys(prods).length);
    const dir = path.join(__dirname, 'data');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'jewelry_raw.json'), JSON.stringify(Object.values(prods)));
})();
