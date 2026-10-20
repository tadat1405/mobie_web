// Nhập sản phẩm trang sức vào MongoDB từ scripts/data/jewelry_raw.json (tạo bởi explore_jewelry.js)
// và bổ sung chi tiết (trọng lượng, đá, ảnh phụ, mô tả) từ trang sản phẩm.
// Chạy: node scripts/import_jewelry.js [số_sản_phẩm_mỗi_danh_mục_để_crawl_chi_tiết=60]
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('../src/models/ProductModel');

const B = 'https://huythanhjewelry.vn';
const UA = { 'User-Agent': 'Mozilla/5.0 (compatible; student-project-crawler)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const DETAIL_PER_CATEGORY = Number(process.argv[2]) || 60;

const rules = [
    ['Nhẫn cưới', /nhẫn cưới|cặp nhẫn cưới/i],
    ['Nhẫn cầu hôn', /nhẫn cầu hôn/i],
    ['Bộ trang sức', /bộ trang sức/i],
    ['Dây chuyền & Mặt dây', /dây chuyền|mặt dây|dây cổ/i],
    ['Bông tai', /bông tai|khuyên tai/i],
    ['Lắc & Vòng tay', /lắc|vòng|kiềng/i],
    ['Nhẫn thời trang', /nhẫn/i],
    ['Charm & Phụ kiện', /charm|cài áo|phonesticker|vỉ|mặt|set /i],
];
const categoryOf = (name) => (rules.find(([, re]) => re.test(name)) || ['Charm & Phụ kiện'])[0];
const materialOf = (g) => (g === 'BAC925' ? 'Bạc 925' : g ? `Vàng ${g}` : 'Khác');
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

const decode = (s) => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
    .replace(/&#039;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();

function parseDetail(html, id) {
    const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '')
        .replace(/<[^>]+>/g, '|').replace(/\|[\s|]*\|/g, '|');
    const start = text.indexOf('Mã sản phẩm:|', text.indexOf('Chi tiết sản phẩm'));
    const end = text.search(/\|Xem thêm|\|1\. DỊCH VỤ BẢO HÀNH/);
    const specs = {};
    if (start > -1 && end > start) {
        const seg = text.slice(start, end).split('|').map((t) => decode(t)).filter((t) => t && t !== ':');
        const blocks = [];
        let cur = null;
        for (let i = 0; i < seg.length; i++) {
            if (/^Mã sản phẩm:?$/.test(seg[i])) { cur = { code: seg[i + 1], rows: [] }; blocks.push(cur); i++; continue; }
            if (cur && /:$/.test(seg[i])) { cur.rows.push([seg[i].replace(/:$/, ''), '']); continue; }
            if (cur && cur.rows.length && seg[i - 1] !== undefined) {
                const last = cur.rows[cur.rows.length - 1];
                last[1] += (last[1] ? ' · ' : '') + seg[i];
            } else if (cur && ['Loại đá', 'Thông tin đá'].includes(seg[i])) cur.rows.push([seg[i], '']);
        }
        blocks.forEach((b, idx) => {
            const rows = b.rows.filter(([, v]) => v);
            if (idx === 0) rows.forEach(([k, v]) => { specs[k] = v; });
            else specs[`Phiên bản ${b.code}`] = rows.map(([k, v]) => `${k}: ${v}`).join(' | ');
        });
        if (blocks[0]) specs['Mã sản phẩm'] = blocks[0].code;
    }
    const imgs = new Set();
    for (const m of html.matchAll(/https:\/\/cdn\.huythanhjewelry\.vn\/storage\/[^"'\s\\)]+?\.(?:png|jpe?g|webp)/gi)) {
        if (m[0].includes(`/${id}/`)) imgs.add(m[0]);
    }
    const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
    return { specs, images: [...imgs].slice(0, 8), description: desc ? decode(desc) : '' };
}

(async () => {
    const raw = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'jewelry_raw.json'), 'utf8'))
        .filter((p) => p.PRICE > 0 && p.FEATURED_IMG_1 && p.SLUG);
    console.log('raw usable:', raw.length);

    const docs = raw.map((p) => {
        const category = categoryOf(p.NAME);
        const hasDiscount = Math.random() < 0.45;
        const discount = hasDiscount ? [5, 8, 10, 12, 15][rand(0, 4)] : 0;
        return {
            name: `${p.EXTRA_NAME || p.NAME} ${p.PRODID || ''}`.replace(/\s+/g, ' ').trim(),
            image: p.FEATURED_IMG_1,
            images: [p.FEATURED_IMG_2].filter(Boolean),
            type: category,
            category,
            brand: p.MAIN_NAME || '',
            material: materialOf(p.GROUPS),
            price: Math.round(p.PRICE),
            discount,
            oldPrice: discount ? Math.round(p.PRICE / (1 - discount / 100) / 1000) * 1000 : undefined,
            countInStock: rand(3, 60),
            rating: Number((4.3 + Math.random() * 0.7).toFixed(1)),
            selled: rand(5, 400),
            description: `${p.EXTRA_NAME || p.NAME} - ${p.MAIN_NAME || 'Trang sức'}. Chất liệu ${materialOf(p.GROUPS)}.`,
            specs: { 'Mã sản phẩm': p.PRODID || '', 'Chất liệu': materialOf(p.GROUPS), 'Bộ sưu tập': p.MAIN_NAME || '' },
            sourceUrl: `${B}/products/${p.SLUG}?grade=${p.GROUPS || ''}`,
            _slug: p.SLUG, _id: p.ID, _grade: p.GROUPS || '',
        };
    });

    // loại trùng tên
    const byName = new Map();
    docs.forEach((d) => { if (!byName.has(d.name)) byName.set(d.name, d); });
    const list = [...byName.values()];
    const counts = {};
    list.forEach((d) => { counts[d.category] = (counts[d.category] || 0) + 1; });
    console.log('categories:', counts);

    // chọn mẫu để crawl chi tiết
    const perCat = {};
    const detailTargets = list.filter((d) => {
        perCat[d.category] = (perCat[d.category] || 0) + 1;
        return perCat[d.category] <= DETAIL_PER_CATEGORY;
    });
    console.log('detail crawl:', detailTargets.length);

    let done = 0;
    const worker = async (queue) => {
        while (queue.length) {
            const d = queue.shift();
            try {
                const r = await fetch(`${B}/products/${d._slug}?grade=${d._grade}`, { headers: UA });
                if (r.ok) {
                    const det = parseDetail(await r.text(), d._id);
                    if (Object.keys(det.specs).length) d.specs = { ...d.specs, ...det.specs };
                    if (det.images.length) d.images = [...new Set([...d.images, ...det.images.filter((u) => u !== d.image)])].slice(0, 8);
                    if (det.description && det.description.length > 40) d.description = det.description;
                }
            } catch (e) { /* bỏ qua, giữ dữ liệu cơ bản */ }
            if (++done % 25 === 0) console.log(`detail ${done}/${detailTargets.length}`);
            await sleep(450);
        }
    };
    const queue = [...detailTargets];
    await Promise.all([worker(queue), worker(queue), worker(queue)]);

    await mongoose.connect(process.env.MONGO_DB);
    await Product.deleteMany({});
    const clean = list.map(({ _slug, _id, _grade, ...rest }) => rest);
    await Product.insertMany(clean, { ordered: false });
    console.log('imported:', await Product.countDocuments());
    await mongoose.disconnect();
})();
