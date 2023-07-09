const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createBlog,updateBlog,getBlog,getAllBlogs,deleteBlog,liketheBlog,disliketheBlog,uploadImages } = require('../controller/blogCtrl');
const { uploadPhoto, blogImgResize } = require('../middlewares/uploadImages');

router.post("/create", authMiddleware, isAdmin, createBlog);
router.put("/update/:id", authMiddleware, isAdmin, updateBlog);
router.put("/upload/:id",authMiddleware,isAdmin,uploadPhoto.array("images",2),blogImgResize,uploadImages)
router.get("/:id", getBlog);
router.get("/", getAllBlogs);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteBlog);
router.put("/likes", authMiddleware, liketheBlog);
router.put("/dislikes", authMiddleware, disliketheBlog);


module.exports = router;