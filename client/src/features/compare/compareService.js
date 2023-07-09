
import axios from "axios";
import { base_url, config } from "../../utils/axiosConfig";

const getProductCompare = async (idProd) => {
    try {
        const response = await axios.get(`${base_url}product/getproduct/${idProd}`)
        if (response.data) {
            return response.data;
        }
    } catch (error) {
        console.log("Error from service")
    }
}

export const compareService = {
    getProductCompare,
    
}