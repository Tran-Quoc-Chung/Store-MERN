import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {productService} from "../product/productService"
import { toast } from "react-toastify";

export const getAllProducts = createAsyncThunk("product/get", async ( query,thunkAPI) => {
    try {
        if (!query) query = {};
        return await productService.getProducts(query)
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
});

export const getSingleProduct = createAsyncThunk("product/getSingleProduct", async (productId, thunkAPI) => {
    try {
        return await productService.getSingleProduct(productId)
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
})

export const addToWishList = createAsyncThunk("product/wishlist", async (prodId, thunkAPI) => {
    try {
        return await productService.addToWishList(prodId);
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
});




export const getNewProduct = createAsyncThunk("product/getnewproduct", async (thunkAPI) => {
    try {
        return await productService.getNewProduct();

    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const getCategory = createAsyncThunk("product/category",async (thunkAPI) => {
    try {
        return await productService.getCategory();

    } catch (error) {
         return thunkAPI.rejectWithValue(error);
       
    }
})
export const addComment = createAsyncThunk("product/add-comment", async (data, thunkAPI) => {
    try {
        return await productService.postComment(data)
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
});

export const getAllComment = createAsyncThunk("product/get-all-rating",async (thunkAPI) => {
    try {
        return await productService.getAllComment();
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
})

const productState = {
    product: "",
    isError: false,
    isLoading: false,
    isSuccess: false,
    message:"",
}
export const productSlice = createSlice({
    name: "product",
    initialState: productState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllProducts.pending, (state) => {
            state.isLoading = true;
        }).addCase(getAllProducts.fulfilled, (state,action) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
            state.product = action.payload;

        }).addCase(getAllProducts.rejected, (state,action) => {
            state.isError = true;
            state.isSuccess = false;
            state.isLoading = false;
            if (state.isError) {
                toast.error("Sorry, this page not exist product!!")
            }
            state.message = action.error;

        }).addCase(addToWishList.pending, (state) => {
            state.isLoading = true;

        }).addCase(addToWishList.fulfilled, (state, action) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
            state.addToWishList = action.payload;
            state.message = "Added to wishlist";
            if (state.isSuccess) {
                toast.success("Success, check your wishlist!!")
            }

        }).addCase(addToWishList.rejected, (state, action) => {
            state.isError = true;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = action.error;
            if (state.isError) {
                toast.error("Add to your wishlist failed. Try again!!")
            }

        }).addCase(getSingleProduct.pending, (state) => {
            state.isLoading = true;

        }).addCase(getSingleProduct.fulfilled, (state, action) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
            state.singleProduct = action.payload;
            state.message = "Get singleproduct";

        }).addCase(getSingleProduct.rejected, (state, action) => {
            state.isError = true;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = action.error;

        }).addCase(getNewProduct.pending, (state) => {
            state.isLoading = true;

        }).addCase(getNewProduct.fulfilled, (state, action) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
            state.newProduct = action.payload;
            state.message = "Get new product";

        }).addCase(getNewProduct.rejected, (state, action) => {
            state.isError = true;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = action.error;

        }).addCase(getCategory.pending, (state) => {
            state.isLoading = true;

        }).addCase(getCategory.fulfilled, (state, action) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
            state.category = action.payload;
            state.message = "Get category";

        }).addCase(getCategory.rejected, (state, action) => {
            state.isError = true;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = action.error;

        }).addCase(addComment.pending, (state) => {
            state.isLoading = true;

        }).addCase(addComment.fulfilled, (state, action) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
            state.singleProduct = action.payload;
            state.message = "Post comment";
            if (state.isSuccess) {
                toast.success("Your comment has been post")
            }

        }).addCase(addComment.rejected, (state, action) => {
            state.isError = true;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = action.error;
            if (state.isError) {
                toast.success("Failed, try again!!")
            }

        }).addCase(getAllComment.pending, (state) => {
            state.isLoading = true;

        }).addCase(getAllComment.fulfilled, (state, action) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
            state.allComment = action.payload;
            state.message = "Get all comment";

        }).addCase(getAllComment.rejected, (state, action) => {
            state.isError = true;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = action.error;

        })
    }
})




export default productSlice.reducer;