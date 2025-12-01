const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware');



router.post('/sign-up', UserController.createUser);
router.post('/sign-in',UserController.loginUser);
router.post('/log-out',UserController.logOutUser);
router.put('/update-user/:id',UserController.updateUser);
router.delete('/delete-user/:id', UserController.deleteUser);
router.get('/get_all_user',UserController.getAllUser);
router.get('/get_details/:id',UserController.getDatails);
router.get('/refresh_token',UserController.refreshToken);
router.post('/delete-many',UserController.deleteMany);
module.exports = router;