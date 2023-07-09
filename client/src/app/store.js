import { configureStore } from "@reduxjs/toolkit";
import authReducers from "../features/user/userSlice";
import productReducer from "../features/product/productSlice"
import blogReducer from "../features/blogs/blogSlice"
import contactReducer from "../features/contact/contactSlice"
import languageReducer from "../features/language/languageSlice"
import compareReducer from "../features/compare/compareSlice"

export const store = configureStore({
    reducer: {
        auth: authReducers,
        product: productReducer,
        blog: blogReducer,
        contact: contactReducer,
        language: languageReducer,
        compare: compareReducer,
        
    }
})
