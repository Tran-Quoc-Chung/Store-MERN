import axios from "axios";
import { base_url,config } from "../../utils/axiosConfig";

const register = async (userData) => {
    const response = await axios.post(`${base_url}user/register`, userData);
    if (response) {
        if (response.data) {
            localStorage.setItem("customer",JSON.stringify(response.data))
        }
        return response.data;
    }
}

const login = async (userData) => {
    const response = await axios.post(`${base_url}user/login`, userData);

    if (response) {
        if (response.data) {
            localStorage.setItem("customer",JSON.stringify(response.data))
        }
        return response.data;
    }
}
const getAllWishlist = async () => {
    const response = await axios.get(`${base_url}user/wishlist`,config);
    if (response) {
        return response.data
    }
}

const getUserCart = async () =>{
    const response = await axios.get(`${base_url}user/cart`,config);
    if (response) {
        return response.data
    }
}

const deleteProductCartUser = async (id) => {
    const response = await axios.delete(`${base_url}user/deletecart/${id}`, config);
    if (response) {
        return response.data
    }
}

const updateQuantityProductCartUser = async (cartId, quantity) => {
    const response = await axios.put(`${base_url}user/updatecart/${cartId}/${quantity}`,null, config);
    if (response) {
        return response.data
    }
}

const sendTokenToUser = async (email) => {
    const response= await axios.post(`${base_url}user/resetpassword`, {email});
    if (response) {
        return response.data;
    }
};

const resetPassword = async (data) => {
    const { token, password } = data;
    const response = await axios.put(`${base_url}user/resetpassword/${token}`,{password});
    if (response.data) {
        return response.data
    } else {
        return "Token exprire. Try again!!"
    }
}

const createOrder = async (data) => {
    // const { shippingInfo, orderItems, totalPrice, totalPriceAfterDiscount } = data;
    // const response=await axios.post(`${base_url}user/order/create-order`,data,config)
    // if (response.data) {
    //     return response.data
    // } else {
    //     return "Create order failed. Try again!!"
    // }
    console.log(data)
}
export const authService = {
    register,
    login,
    getAllWishlist,
    getUserCart,
    deleteProductCartUser,
    updateQuantityProductCartUser,
    sendTokenToUser,
    resetPassword,
    createOrder

}