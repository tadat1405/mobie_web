// Tạo tài khoản + đơn hàng mẫu. Chạy: node scripts/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../src/models/UserModel');
const Product = require('../src/models/ProductModel');
const Order = require('../src/models/OrderProduct');

const USERS = [
    { name: 'Quản trị viên', email: 'admin@mobie.vn', password: 'Admin@123', isAdmin: true, phone: '0900000001', address: '1 Lê Lợi', city: 'Hồ Chí Minh' },
    { name: 'Nguyễn Văn An', email: 'an@mobie.vn', password: 'User@123', isAdmin: false, phone: '0900000002', address: '25 Nguyễn Huệ', city: 'Hồ Chí Minh' },
    { name: 'Trần Thị Bình', email: 'binh@mobie.vn', password: 'User@123', isAdmin: false, phone: '0900000003', address: '12 Trần Phú', city: 'Hà Nội' },
];

(async () => {
    await mongoose.connect(process.env.MONGO_DB);
    const users = [];
    for (const u of USERS) {
        const doc = await User.findOneAndUpdate(
            { email: u.email },
            { $set: { ...u, password: bcrypt.hashSync(u.password, 10) } },
            { upsert: true, new: true }
        );
        users.push(doc);
    }
    const products = await Product.aggregate([{ $sample: { size: 12 } }]);
    if (products.length && !(await Order.countDocuments())) {
        const customers = users.filter((u) => !u.isAdmin);
        for (let i = 0; i < 6; i++) {
            const u = customers[i % customers.length];
            const items = products.slice(i, i + 2).map((p) => ({ name: p.name, amount: 1 + (i % 2), image: p.image, price: p.price, product: p._id }));
            const itemsPrice = items.reduce((s, x) => s + x.price * x.amount, 0);
            const shippingPrice = itemsPrice > 5000000 ? 0 : 30000;
            const paid = i % 3 !== 0;
            await Order.create({
                orderItems: items,
                shippingAddress: { fullName: u.name, address: u.address, city: u.city, phone: u.phone },
                paymentMethod: paid ? 'paypal' : 'later_money',
                itemsPrice, shippingPrice, totalPrice: itemsPrice + shippingPrice,
                user: u._id, isPaid: paid, paidAt: paid ? new Date() : undefined,
                isDelivered: i % 2 === 0, deliveredAt: i % 2 === 0 ? new Date() : undefined,
            });
        }
    }
    console.log('users', await User.countDocuments(), 'orders', await Order.countDocuments());
    await mongoose.disconnect();
})();
