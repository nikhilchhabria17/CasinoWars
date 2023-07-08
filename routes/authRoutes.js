const{Router}=require("express");
const { builtinModules } = require("module");
const authController=require("../controllers/authController");

const router=Router();

router.get("/signup",authController.signup_get);
router.get("/updateBalance",authController.update_balance);
router.post("/signup",authController.signup_post);
router.get("/login",authController.login_get);
router.post("/login",authController.login_post);
router.get("/forgot_password",authController.forgot_password_get);
router.get("/verify/:email",authController.verify);
router.post("/forgot_password",authController.forgot_password_post);
router.get("/reset_password/:token/",authController.reset_password_get);
router.post("/reset_password/:token/",authController.reset_password_post);
router.get("/logout",authController.logout_get);

module.exports=router;