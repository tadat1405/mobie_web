const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
    {
        name: {type: String, required: true, unique: true},
        image: {type: String, required: true},
        type: {type: String, required: true},
        price: {type: Number, required: true},
        countInStock: {type: Number, required: true},
        rating: {type: Number, required: true},
        description: {type: String},
        discount: {type: Number},
        selled: {type: Number},
        images: [{type: String}],
        category: {type: String},
        brand: {type: String},
        material: {type: String},
        oldPrice: {type: Number},
        specs: {type: Map, of: String},
        sourceUrl: {type: String},
    },
    
    {
        timestamps: true
    }
);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
