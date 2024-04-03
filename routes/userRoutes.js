const express=require('express')
const router=express.Router();
const userController=require('./../Controller/userController');
const authController=require('./../Controller/AuthController');
router.route('/').get(userController.getUsers);
router.route('/Signup').post(userController.createUser);
router.route("/login").post(authController.loginHandler);
router.route("/profile").get(userController.profileDetails);

module.exports=router;