const router = require('express').Router();
const AuthController = require('../controllers/UserController');
const { userUpload } = require('../Middlewares/User.Image');


//post methods
// router.post('/register', AuthController.register);
// router.post('/login', AuthController.Login);
// router.get('/logout', AuthController.Logout);
router.route('/register').post(AuthController.register);
router.route('/login').post(AuthController.Login);
router.route('/logout').get(AuthController.Logout);
router.route('/forgot').post(AuthController.forgotPassword);
router.route('/reset/:token').post(AuthController.resetPassword);
router.route('/user/:id/update').put(userUpload,AuthController.UpdateProfile);
router.route('/user/:id').get(AuthController.getUser);
router.route('/users').get(AuthController.GetUsers);
router.route('/user/:id').delete(AuthController.DeleteUser);

// router.route('/auth/google').post(AuthController.googleLogin);


module.exports = router;