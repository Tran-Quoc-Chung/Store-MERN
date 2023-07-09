import axios from "axios";
import { base_url, config } from "../../utils/axiosConfig";

const getBlogs = async () => {
    const response=await axios(`${base_url}blog`)
    if (response.data) {
        return response.data;
    }
}
const getBlog = async (id) => {
    const response=await axios(`${base_url}blog/${id}`)
    if (response.data) {
        console.log("res:",response.data)
        return response.data;
    }else{
        console.log("failed")
    }
}

export const blogService = {
    getBlogs,
    getBlog
}