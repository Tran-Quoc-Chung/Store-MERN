const User = require("../models/userModel");
const Product = require("../models/productModel");
const asyncHandle = require('express-async-handler');
const slugify = require('slugify');
const {cloudinaryUploadImg} = require('../utils/cloudinary');
const validateMongodbId = require("../utils/validateMongodb");
const fs=require('fs')

const createProduct = asyncHandle(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body)
        res.status(200).json({ msg: "Create new product success", newProduct })
    } catch (error) {
        throw new Error(error)
    }
});

const updateProduct = asyncHandle(async (req, res) => {
    try {
        const { id } = req.params;
        const updateProduct = await Product.findByIdAndUpdate(id,
            { $set: req.body },
            { new: true });
        res.status(200).json({ msg: "Update product successfully", updateProduct });
    } catch (error) {
        throw new Error(error)
    }
});

const deleteProduct = asyncHandle(async (req, res) => {
    try {
        const { id } = req.params;
        const deleteProduct = await Product.findByIdAndDelete(id);
        res.status(200).json({ msg: "delete product successfully", deleteProduct });
    } catch (error) {
        throw new Error(error)
    }
});

const getProduct = asyncHandle(async (req, res) => {
    const { id } = req.params;
    try {
        const getProduct = await Product.findById(id).populate("color").populate("ratings.postedby");
        res.status(200).json(getProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllProduct = asyncHandle(async (req, res) => {

    try {

        //filter
        const queryObj = { ...req.query };
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        let query = Product.find(JSON.parse(queryStr));

        //sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort("-createdAt")
        }

        //limit
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        //pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error('This page does exist')
        }

        const getAllProduct = await query;
        res.status(200).json(getAllProduct);
    } catch (error) {
        throw new Error(error);
    }

});

const addToWishlist = asyncHandle(async (req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body;
    try {
        const user = await User.findById(_id);
        const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
        if (alreadyadded) {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $pull: { wishlist: prodId },
                },
                {
                    new: true,
                }
            );
            res.json(user);
        } else {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $push: { wishlist: prodId },
                },
                {
                    new: true,
                }
            );
            res.json(user);
        }
    } catch (error) {
        throw new Error(error);
    }
});

const rating = asyncHandle(async (req, res) => {
    const { _id } = req.user;
    const { star, prodId, comment } = req.body;
    try {
        const product = await Product.findById(prodId);
        let alreadyRated = product.ratings.find(
            (userId) => userId.postedby.toString() === _id.toString()
        );
        if (alreadyRated) {
            const updateRating = await Product.updateOne(
                {
                    ratings: { $elemMatch: alreadyRated },
                },
                {
                    $set: { "ratings.$.star": star, "ratings.$.comment": comment },
                },
                {
                    new: true,
                }
            );
        } else {
            const rateProduct = await Product.findByIdAndUpdate(
                prodId,
                {
                    $push: {
                        ratings: {
                            star: star,
                            comment: comment,
                            postedby: _id,
                        },
                    },
                },
                {
                    new: true,
                }
            );
        }
        const getallratings = await Product.findById(prodId);
        let totalRating = getallratings.ratings.length;
        let ratingsum = getallratings.ratings.map((item) => item.star).reduce((prev, curr) => prev + curr, 0);
        let actualRating = Math.round(ratingsum / totalRating);
        let finalproduct = await Product.findByIdAndUpdate(
            prodId,
            {
                totalrating: actualRating,
            },
            { new: true }
        );
        res.json(finalproduct);
    } catch (error) {
        throw new Error(error);
    }
});


const uploadImages = asyncHandle(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "image");
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newpath = await uploader(path);
            urls.push(newpath);
            fs.unlinkSync(path)
        }
        const findProduct = await Product.findByIdAndUpdate(
            id,
            {
                images: urls.map((file) => {
                    return file;
                }),
            },
            { new: true }
        );
        res.json(findProduct);
    } catch (error) {
        throw new Error(error)
    }
})

const getAllCategory = asyncHandle(async (req, res) => {
    const result = await Product.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
          }
        }
    ]);
    res.json(result);
})

module.exports = { createProduct, getProduct, getAllProduct, updateProduct, deleteProduct, addToWishlist, rating,uploadImages ,getAllCategory}