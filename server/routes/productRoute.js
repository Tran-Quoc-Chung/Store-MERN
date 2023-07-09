const express = require('express');
const router = express.Router();
const { createProduct, getProduct, getAllProduct, updateProduct, deleteProduct,addToWishlist ,rating, uploadImages,getAllCategory} = require('../controller/productCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages');

router.post("/createproduct",authMiddleware,isAdmin, createProduct);
router.put("/upload/:id",authMiddleware,isAdmin,uploadPhoto.array("images",10),productImgResize,uploadImages)
router.get("/getproduct/:id", getProduct);
router.get("/category", getAllCategory);

router.get("/", getAllProduct);

router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rating);
router.put("/update/:id",authMiddleware,isAdmin, updateProduct);
router.delete("/delete/:id",authMiddleware,isAdmin, deleteProduct);

module.exports = router;