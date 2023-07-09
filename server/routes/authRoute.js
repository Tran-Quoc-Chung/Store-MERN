const express = require('express');
const router = express.Router();
const {authMiddleware,isAdmin}=require("../middlewares/authMiddleware")
const { createUser,loginUser,getAllUser,getSingleUser,
    deleteUser, updateUser, unBlockUser, blockUser,
    logout, updatePassword, handleRefreshToken,
    forgotPasswordToken, resetPassword, loginAdmin, getWishlist,
    saveAddress, userCart, getCardUser, applyCoupon, createOrder,deleteProductFromCart, updateQuantityProductFromCart, getUserOrder } = require("../controller/userCtrl");

router.post("/register",createUser);
router.post("/resetpassword", forgotPasswordToken);
router.post("/login", loginUser);
router.post("/admin-login", loginAdmin);
router.post("/add-cart", authMiddleware, userCart);
router.post("/order/create-order", authMiddleware, createOrder);
// router.post("/cart/applycoupon", authMiddleware, applyCoupon);




router.get("/alluser", getAllUser);
router.get("/refesh",handleRefreshToken)
router.get("/logout", logout);
router.get("/cart", authMiddleware, getCardUser);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/getorders", authMiddleware, getUserOrder);
//router.get("/getorders", authMiddleware, getOrders);
router.get("/getuser/:id", authMiddleware, isAdmin, getSingleUser);


router.delete("/deletecart/:cartId",authMiddleware, deleteProductFromCart);
router.delete("/deleteUser/:id", deleteUser);


router.put("/password", authMiddleware, updatePassword);
router.put("/resetpassword/:token", resetPassword);
router.put("/update/:id", authMiddleware, updateUser);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/block-user/:id",authMiddleware,isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unBlockUser);
// router.put("/order/update-order/:id", authMiddleware, isAdmin, updateOrderStatus);
 router.put("/updatecart/:cartId/:newQuantity",authMiddleware, updateQuantityProductFromCart);



module.exports = router;