const path=require("path")
const {Router}=require('express')
const authController=require(path.resolve('./controllers/auth'))
const auth=require(path.resolve('./middleware/auth'))
const router=Router()

router.post('/register',authController.signup)
router.post('/login', authController.login);
router.get('/user', auth, authController.get_user);
router.post('/logout',authController.logout);

module.exports =router