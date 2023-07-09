const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandle = require("express-async-handler");
const validateMongodbId=require("../utils/validateMongodb");
const { cloudinaryUploadImg } = require("../utils/cloudinary");
const fs =require('fs')

const createBlog = asyncHandle(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);
      } catch (error) {
        throw new Error(error);
      }
});

const updateBlog = asyncHandle(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updateBlog = await Blog.findByIdAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true }
    );
    res.json(updateBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const getBlog = asyncHandle(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const getBlog = await Blog.findById(id).populate("likes").populate("dislikes");
    const updateViews = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
    res.json(getBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBlogs = asyncHandle(async (req, res) => {
  try {
    const getBlogs = await Blog.find();
    res.json(getBlogs);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlog = asyncHandle(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  console.log(id);
  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    res.json({msg:"Delete blog successfully",deletedBlog});
  } catch (error) {
    throw new Error(error);
  }
});

const liketheBlog = asyncHandle(async (req, res) => {
  const { blogId } = req.body;
  validateMongodbId(blogId);
  const blog = await Blog.findById(blogId);
  const loginUserId = req?.user?._id;
  const isLiked = blog?.isLiked;
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});

const disliketheBlog = asyncHandle(async (req, res) => {
  const { blogId } = req.body;
  validateMongodbId(blogId);
  const blog = await Blog.findById(blogId);
  const loginUserId = req?.user?._id;
  const isDisLiked = blog?.isDisliked;
  const alreadyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isDisLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});

const uploadImages = asyncHandle(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
      const uploader = (path) => cloudinaryUploadImg(path, "image");
      const urls = [];
    const files = req.files;
    console.log("url:",urls,"files:",files)
      for (const file of files) {
          const { path } = file;
          const newpath = await uploader(path);
        urls.push(newpath);
        fs.unlinkSync(path);
      }
      const findBlog = await Blog.findByIdAndUpdate(
          id,
          {
              images: urls.map((file) => {
                  return file;
              }),
          },
          { new: true }
      );
      res.json(findBlog);
  } catch (error) {
      throw new Error(error.message)
  }
})

module.exports={createBlog,updateBlog,getBlog,getAllBlogs,deleteBlog,liketheBlog,disliketheBlog,uploadImages}