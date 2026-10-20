// Crawl sản phẩm từ cellphones.com.vn vào MongoDB. Chạy: node scripts/crawl.js
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../src/models/ProductModel');

const BASE = 'https://cellphones.com.vn';
const UA = { 'User-Agent': 'Mozilla/5.0 (compatible; student-project-crawler)' };
const DELAY = 700;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const LISTINGS = [
    'mobile.html', 'mobile/apple.html', 'mobile/samsung.html', 'mobile/xiaomi.html', 'mobile/oppo.html',
    'mobile/honor.html', 'mobile/realme.html', 'mobile/vivo.html', 'mobile/nokia.html', 'mobile/tecno.html',
    'laptop.html', 'laptop/macbook.html', 'laptop/asus.html', 'laptop/dell.html', 'laptop/hp.html',
    'laptop/lenovo.html', 'laptop/acer.html', 'laptop/msi.html',
    'tablet.html', 'tablet/ipad.html', 'tablet/samsung.html', 'tablet/xiaomi.html',
    'thiet-bi-am-thanh.html', 'do-choi-cong-nghe/dong-ho-thong-minh.html', 'phu-kien.html',
];

const get = async (url) => {
    const res = await fetch(url, { headers: UA });
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    return res.text();
};
const decode = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"').replace(/&#039;|&#39;/g, "'").replace(/\s+/g, ' ').trim();
const ldBlocks = (h) => [...h.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)]
    .map((m) => { try { return JSON.parse(m[1]); } catch { return null; } }).filter(Boolean);

async function collectLinks() {
    const links = new Set();
    for (const l of LISTINGS) {
        try {
            const h = await get(`${BASE}/${l}`);
            for (const m of h.matchAll(/href="(https:\/\/cellphones\.com\.vn\/[a-z0-9-]+\.html)"/g)) links.add(m[1]);
            console.log('listing', l, '->', links.size);
        } catch (e) { console.log('skip listing', l, e.message); }
        await sleep(DELAY);
    }
    return [...links];
}

async function parseProduct(url) {
    const h = await get(url);
    const blocks = ldBlocks(h);
    const p = blocks.find((b) => b['@type'] === 'Product');
    if (!p) return null;
    const crumbs = (blocks.find((b) => b['@type'] === 'BreadcrumbList')?.itemListElement || [])
        .map((c) => c.item?.name).filter(Boolean);
    const offer = Array.isArray(p.offers) ? p.offers[0] : p.offers;
    const price = Number(offer?.price || 0);
    if (!price) return null;
    const imgs = new Set();
    for (const m of h.matchAll(/https:\/\/cdn\d*\.cellphones\.com\.vn\/[^"'\s)]*?\/media\/catalog\/product\/[^"'\s)]+\.(?:jpg|jpeg|png|webp)/gi))
        imgs.add(m[0].replace(/\/(\d+x\d*|x\d+)\//, '/500x/'));
    const mainImage = String(p.image || '').replace(/\/\d+x\//, '/500x/');
    const gallery = [...imgs].filter((i) => i !== mainImage).slice(0, 8);
    const old = h.match(/class="[^"]*(?:old-price|product__price--through)[^"]*"[^>]*>\s*([\d.,]+)\s*(?:₫|đ)/i);
    const oldPrice = old ? Number(old[1].replace(/\D/g, '')) : 0;
    const discount = oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : 0;
    const specs = {};
    for (const a of p.additionalProperty || []) if (a.name && a.value) specs[a.name] = String(a.value);
    const brand = crumbs[2] || p.brand?.name || '';
    return {
        name: decode(p.name),
        image: mainImage || gallery[0],
        images: gallery,
        category: crumbs[1] || 'Khác',
        type: crumbs[1] || 'Khác',
        brand,
        price,
        oldPrice: oldPrice > price ? oldPrice : undefined,
        discount,
        countInStock: 20 + Math.floor(Math.random() * 180),
        rating: Number((4 + Math.random()).toFixed(1)),
        selled: Math.floor(Math.random() * 500),
        description: decode(p.description || ''),
        specs,
        sourceUrl: url,
    };
}

(async () => {
    await mongoose.connect(process.env.MONGO_DB);
    const only = Number(process.argv[2]) || Infinity;
    const links = (await collectLinks()).slice(0, only);
    console.log('product links:', links.length);
    let ok = 0, fail = 0;
    for (const [i, url] of links.entries()) {
        try {
            const d = await parseProduct(url);
            if (d) {
                await Product.updateOne({ name: d.name }, { $set: d }, { upsert: true });
                ok++;
            }
        } catch (e) { fail++; console.log('fail', url, e.message); }
        if (i % 20 === 0) console.log(`${i + 1}/${links.length} ok=${ok} fail=${fail}`);
        await sleep(DELAY);
    }
    console.log('done', { ok, fail, total: await Product.countDocuments() });
    await mongoose.disconnect();
})();
