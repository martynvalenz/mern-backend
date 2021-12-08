const {Router} = require('express');
const { validateJWT } = require('../middlewares/validate-jwt');
const authController = require('./authController');
const router = Router();

router.post('/signup', authController.signUp);
router.get('/users', validateJWT, authController.users);
router.get('/users/:id', validateJWT, authController.userById);
router.put('/users/:id', validateJWT, authController.updateUser);
router.delete('/users/:id', validateJWT, authController.deleteUser);
router.post('/signin', authController.signIn);
router.get('/signout', validateJWT, authController.signOut);
router.get('/refresh-token', validateJWT, authController.refreshToken);

module.exports = router;