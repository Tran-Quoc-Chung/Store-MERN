const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandle = require('express-async-handler')
const validateMongodbId = require('../utils/validateMongodb');
const generateRefeshToken = require('../config/refeshToken')
const sendEmail = require("./emailCtrl");
const crypto = require('crypto');
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const uniqid = require('uniqid')

const createUser = asyncHandle(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });

    if (!findUser) {
        const newUser = await User.create(req.body);
        res.status(200).json(newUser);
    } else {
        throw new Error("User already exist");
    }
});

const loginUser = asyncHandle(async (req, res) => {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
        const refeshToken = generateRefeshToken(findUser?._id);
        const updateUser = await User.findByIdAndUpdate(findUser._id, { refeshToken: refeshToken }, { new: true });
        res.cookie("refeshToken", refeshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })
        res.json({
            _id: findUser?._id,
            firstName: findUser?.firstName,
            lastName: findUser?.lastName,
            email: findUser?.email,
            password: findUser?.password,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        })
    } else {
        throw new Error("Invalid credential");
    }
});

const loginAdmin = asyncHandle(async (req, res) => {
    const { email, password } = req.body;
    const findAdmin = await User.findOne({ email });
    if (findAdmin.role !== "admin") throw new Error("Not Authorised");
    if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
        const refreshToken = await generateRefeshToken(findAdmin?._id);
        const updateuser = await User.findByIdAndUpdate(
            findAdmin.id,
            {
                refeshToken: refreshToken,
            },
            { new: true }
        );
        res.cookie("refeshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id),
        });
    } else {
        throw new Error("Invalid Credentials");
    }
});

const handleRefreshToken = asyncHandle(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error(" No Refresh token present in db or not matched");
    jwt.verify(refreshToken, process.env.JWT_CODE, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong with refresh token");
        }
        const accessToken = generateToken(user?._id);
        res.json({ accessToken });
    });
});

const logout = asyncHandle(async (req, res) => {
    const cookie = req.cookies;
    console.log("cookie:", cookie)
    if (!cookie?.refeshToken) throw new Error("No refesh token in cookie");
    const token = cookie?.refeshToken;
    const user = await User.findOne({ token });
    if (!user) {
        res.clearCookie("refeshToken", {
            httpOnly: true,
            secure: true
        });
        return res.status(204).json("forBidden")
    }
    await User.findOneAndUpdate(token, {
        refeshToken: "",
    });
    res.clearCookie("refeshToken", {
        httpOnly: true,
        secure: true
    });
    return res.status(200).json("Logout success")
})

const getAllUser = asyncHandle(async (req, res) => {
    try {
        const getAllUser = await User.find();
        if (getAllUser) res.status(200).json(getAllUser);

    } catch (error) {
        throw new Error(error);
    }

});

const getSingleUser = asyncHandle(async (req, res) => {
    try {
        const { id } = req.params;
        const findUser = await User.findById(id);
        if (findUser) {
            res.status(200).json(findUser)
        } else {
            res.status(401).json("User not exist");
        }
    } catch (error) {
        throw new Error(error);
    }

})

const deleteUser = asyncHandle(async (req, res) => {
    try {
        const { id } = req.params;
        const deleteUser = await User.findByIdAndDelete(id);
        if (deleteUser) {
            res.status(200).json("User has been delete")
        } else {
            res.status(401).json("User not exist");
        }
    } catch (error) {
        throw new Error(error);
    }

})

const updateUser = asyncHandle(async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await User.findByIdAndUpdate(
            { _id: id },
            { $set: req.body },
            { new: true }
        );
        if (updated) {
            res.status(200).json("User has been update")
        } else {
            res.status(401).json("User not exist");
        }
    } catch (error) {
        throw new Error(error);
    }

});

const blockUser = asyncHandle(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const block = User.findByIdAndUpdate(
            id,
            {
                isBlocked: true
            },
            {
                new: true
            }
        );
        res.json({
            message: "User blocked",
        })
    } catch (error) {
        throw new Error(error);
    }
});

const unBlockUser = asyncHandle(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const unblock = User.findByIdAndUpdate(
            id,
            {
                isBlocked: false
            },
            {
                new: true
            }
        );
        res.json({
            message: "User unblocked",
        })
    } catch (error) {
        throw new Error(error);
    }
});

const updatePassword = asyncHandle(async (req, res) => {
    const { _id } = req.user;
    const password = req.body?.password;
    console.log("id:", _id, "pass:", password)
    validateMongodbId(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatePassword = await user.save();
        res.status(201).json({ msg: "Change password successfuly", updatePassword });
    } else {
        res.json(user);
    }
});

const forgotPasswordToken = asyncHandle(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found with this email");
    
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:3014/reset-password/${token}'>Click Here</>`;
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot Password Link",
            html: resetURL,
        };
        sendEmail(data);
        res.json(token);
    } catch (error) {
        res.json(error)
        throw new Error(error);
    }
});

const resetPassword = asyncHandle(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error("Token expired. Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.status(200).json({ msg: "Change password successfully", user });
})

const getWishlist = asyncHandle(async (req, res) => {
    const { _id } = req.user;
    console.log(_id)
    try {
        const findUser = await User.findById(_id).populate("wishlist");
        res.json(findUser)
    } catch (error) {
        throw new Error(error);
    }
});

const saveAddress = asyncHandle(async (req, res, next) => {
    const { _id } = req.user;
    console.log(_id)
    validateMongodbId(_id);

    try {
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                address: req?.body?.address,
            },
            {
                new: true,
            }
        );
        res.json(updatedUser);
    } catch (error) {
        throw new Error(error);
    }
});

const userCart = asyncHandle(async (req, res) => {
    const { productId,color,quantity,price } = req.body;
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        let newCart = await new Cart({
            userId: _id,
            productId,
            color,
            price,
            quantity  
        }).save();

        const cart = await Cart.find({userId: _id })
        .populate("productId")
        .populate("color")
        .exec();
    
      res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
});

const getCardUser = asyncHandle(async (req, res) => {
    const { _id } = req.user;
    try {
        const cart = await Cart.find({ userId: _id }).populate("productId").populate("color");
        res.json(cart);
    } catch (error) {
        console.log("err:")
        throw new Error(error);
    }
});

const deleteProductFromCart = asyncHandle(async (req,res) => {
    const { _id } = req.user;
    const { cartId } = req.params;
    console.log(_id, cartId)
    try {
        const deleteProduct = await Cart.deleteOne({ userId: _id, _id: cartId })
        const cartUserNew= await Cart.find({ userId: _id }).populate("productId").populate("color");
        res.json(cartUserNew);
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
})

const updateQuantityProductFromCart = asyncHandle(async (req,res) => {
    const { _id } = req.user;
    const { cartId, newQuantity } = req.params;
    console.log(cartId,newQuantity)
    try {
        const cartItem = await Cart.findOne({ userId: _id, _id: cartId })
        cartItem.quantity = newQuantity;
        cartItem.save();
        res.json(cartItem);
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
})

const applyCoupon = asyncHandle(async (req, res) => {
    const { coupon } = req.body;
    const { _id } = req.user;
    validateMongodbId(_id);
    const validCoupon = await Coupon.findOne({ name: coupon });
    if (!validCoupon) {
        throw new Error("Coupon don't exist!!");
    }
    let { products, cartTotal } = await Cart.findOne({ orderby: _id }).populate("products.product");
    let totalAfterDiscount = (
        cartTotal - ((cartTotal * validCoupon.discount) / 100)
    ).toFixed(2);

    await Cart.findOneAndUpdate(
        { orderby: _id },
        { totalAfterDiscount: totalAfterDiscount },
        { new: true },
    )
    res.json(totalAfterDiscount);
});

const createOrder = asyncHandle(async (req, res) => {
    const { _id } = req.user;
    const { shippingInfo, orderItems, totalPrice, totalPriceAfterDiscount } = req.body;
    console.log(orderItems)
    try {
        const order = await Order.create({ user: _id, shippingInfo, orderItems, totalPrice, totalPriceAfterDiscount });
        console.log("order:", order)
        res.json({
            order: order,
            success: true
        })
    } catch (error) {
        throw new Error(error)
    }
});

const getUserOrder = asyncHandle(async (req, res) => {
    const { _id } = req.user;
    try {
        const userOrder =await  Order.find({ user: _id }).populate("orderItems.product")
        res.json({userOrder});
    } catch (error) {
        throw new Error(error)
    }
})

// const createOrder = asyncHandle(async (req, res) => {
//     const { COD, couponApplied } = req.body;
//     const { _id } = req.user;
//     validateMongodbId(_id);
//     try {
//         if (!COD) throw new Error("Create cash order failed");
//         const user = await User.findById(_id);
//         let userCart = await Cart.findOne({ orderby: user._id });
//         let finalAmout = 0;
//         if (couponApplied && userCart.totalAfterDiscount) {
//             finalAmout = userCart.totalAfterDiscount;
//         } else {
//             finalAmout = userCart.cartTotal
//         }

//         let newOrder = await new Order({
//             products: userCart.products,
//             paymentIntent: {
//                 id: uniqid(),
//                 method: "COD",
//                 amount: finalAmout,
//                 status: "Cash on Delivery",
//                 created: Date.now(),
//                 currency: "VND",
//             },
//             orderby: user._id,
//             orderStatus: "Cash on Delivery",
//         }).save();
//         let update = userCart.products.map((item) => {
//             return {
//                 updateOne: {
//                     filter: { _id: item.product._id },
//                     update: { $inc: { quantity: -item.count, sold: +item.count } },
//                 },
//             };
//         });
//         const updated = await Product.bulkWrite(update, {});
//         res.json({ message: "success" });
//     } catch (error) {
//         throw new Error(error);
//     }
// });

// const getOrders = asyncHandle(async (req, res) => {
//     const { _id } = req.user;
//     validateMongodbId(_id);
//     try {
//         const getOrder = await Order.findOne({ orderby: _id }).populate("products.product");
//         res.json(getOrder);
//     } catch (error) {
//         throw new Error(error)
//     }
// })

// const updateOrderStatus = asyncHandle(async (req, res) => {
//     const { status } = req.body;
//     const { id } = req.params;
//     try {
//         const order = await Order.findByIdAndUpdate(id,
//             {
//                 orderStatus: status,
//                 paymentIntent: {
//                     status: status
//                 },

//             },
//             { new: true }
//         );
//         res.json(order);
//     } catch (error) {
//         throw new Error(error);
//     }
// })

module.exports = {
    createUser,
    loginUser,
    getAllUser,
    getSingleUser,
    deleteUser,
    updateUser,
    blockUser,
    unBlockUser,
    logout,
    updatePassword,
    handleRefreshToken,
    forgotPasswordToken,
    resetPassword,
    loginAdmin,
    getWishlist,
    saveAddress,
    userCart,
    getCardUser,
    applyCoupon,
     createOrder,
    // getOrders,
    // updateOrderStatus,
    deleteProductFromCart,
    updateQuantityProductFromCart,
    getUserOrder
};