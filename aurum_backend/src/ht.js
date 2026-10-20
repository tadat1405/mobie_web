const { createClient } = require('@huythanh-dev/ht-recommend')

const client = createClient({
    appId: '298381759',
    apiKey: process.env.HT_WRITE_KEY,
    baseUrl: 'https://hta-admin.giavanghomnay.cloud/api/v1/ingest',
})

const catalog = client.catalog({
    transform: (doc) => ({
        ...(doc.toObject ? doc.toObject({ flattenMaps: true }) : doc),
        id: String(doc._id),
    }),
})

module.exports = { catalog }
