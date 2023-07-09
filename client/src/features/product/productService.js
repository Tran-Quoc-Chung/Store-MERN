import axios from "axios";
import { base_url, config } from "../../utils/axiosConfig";
import querystring from 'querystring'



const getProducts = async (statusQuery) => {
    const { page, query } = statusQuery;
    if (Object.entries(statusQuery).length !== 0) {
        const queryString = querystring.stringify(query);
        const response = await axios.get(`${base_url}product?page=${page}&limit=9&${queryString}`);
        if (response){
            return response.data;
        }
    } else {
        console.log("test from prod service")
        const response = await axios.get(`${base_url}product`);
        if (response){
            return response.data;
        }
    }

}
const addToWishList = async (prodId) => {
    const response = await axios.put(`${base_url}product/wishlist`,{prodId},config);
    if (response){
        return response.data;
    }
}

const getSingleProduct = async (productId) => {
    const response = await axios.get(`${base_url}product/getproduct/${productId}`)
    if (response.data) {
        return response.data;
    }
}

const addToCard = async (cartData) => {
    const user = localStorage.getItem("customer")

    const response = await axios.post(`${base_url}user/add-cart`,cartData,config)
    if (response.data) {
        return response.data;
    }
}

const getNewProduct = async () => {
    const response = await axios.get(`${base_url}product?sort=-createdAt&limit=5`);
    if (response.data) {
        return response.data;
    }
    
}    

const getCategory = async () => {
    const response = await axios.get(`${base_url}product/category`);
    if (response.data) {
        return response.data
    }
}

const postComment = async (data) => {
   const response = await axios.put(`${base_url}product/rating`, data,config);
    if (response.data) {
        return response.data;
    }
}


export const productService = {
    getProducts,
    addToWishList,
    getSingleProduct,
    addToCard,
    getNewProduct,
    getCategory,
    postComment,
}