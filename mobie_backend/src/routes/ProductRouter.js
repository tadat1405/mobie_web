const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware');



router.post('/create', ProductController.createProduct);
router.put('/update/:id', authMiddleware,ProductController.updateProduct);
router.get('/get_details/:id',ProductController.getDetailsProduct);
router.delete('/delete-product/:id',authMiddleware,ProductController.deleteProduct);
router.get('/get-all-product',ProductController.getAllProduct);
router.post('/delete-many',authMiddleware,ProductController.deleteMany);
router.get('/get-all-type',ProductController.getAllType);
module.exports = router


