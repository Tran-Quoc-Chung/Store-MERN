const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")
const {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getallCategory,
} = require("../controller/prodCategoryCtrl"); 
  
router.post("/", authMiddleware, isAdmin, createCategory);
router.put("/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteCategory);
router.get("/:id", getCategory);
router.get("/", getallCategory);
module.exports = router;