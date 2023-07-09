import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "./userService";
import { productService } from "../product/productService";
import { toast } from "react-toastify";

export const registerUser = createAsyncThunk("auth/register", async (userData,thunkAPI) => {
    try {
        return await authService.register(userData);
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
});

export const loginUser = createAsyncThunk("auth/login", async (userData,thunkAPI) => {
    try {
        return await authService.login(userData);
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
});

const getUserFromLocalStorage = localStorage.getItem("customer") ? JSON.parse(localStorage.getItem("customer")) : null;

export const getUserWishlist = createAsyncThunk("user/wishlist", async ( thunkAPI) => {
    try {
        const res = await authService.getAllWishlist();
        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
});

export const getUserCart = createAsyncThunk("user/getusercart", async (thunkAPI) => {
    try {
        return  await authService.getUserCart();
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
})

export const deleteProductCart = createAsyncThunk("user/deleteProductFromCart", async (cartId,thunkAPI) => {
    try {
        return  await authService.deleteProductCartUser(cartId);
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
})

export const updateProductCart = createAsyncThunk("user/updateProductFromCart", async ({ cartId, quantity }, thunkAPI) => {
    console.log("from slice",cartId,quantity)
    try {
        return  await authService.updateQuantityProductCartUser(cartId,quantity);
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
})

export const addtoCart = createAsyncThunk("user/add-cart", async (cartData, thunkAPI) => {
    try {
        return await productService.addToCard(cartData);
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const sendTokenFogotPassword = createAsyncThunk("user/fogot-password", async (email, thunkAPI) => {
    try {
        return await authService.sendTokenToUser(email);
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const resetPassword = createAsyncThunk("user/reset-password", async (data, thunkAPI) => {
    try {
        return await authService.resetPassword(data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const createOrderUser = createAsyncThunk("user/order/create-order", async (data,thunkAPI) => {
    try {
       // return await authService.createOrder(data);
        console.log(data)
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

const initialState = {
    user: getUserFromLocalStorage,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => {
            state.isLoading = true;
        }).addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.createdUser = action.payload;
            if (state.isSuccess) {
                toast.success('Register user successfully')
            }
        }).addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
            state.message = action.error;
            if (state.isError) {
                toast.error('Register user failed. Try again!!');
            }
        }).addCase(loginUser.pending, (state) => {
            state.isLoading = true;
        }).addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.user = action.payload;
           
            if (state.isSuccess) {
                localStorage.setItem("token", action.payload.token);
                toast.success('Login successfully')
            }
        }).addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
            state.message = action.error;
            if (state.isError) {
                toast.error('Login failed. Try again!!');
            }
        }).addCase(getUserWishlist.pending, (state) => {
            state.isLoading = true;
            state.message = "loading";
            if (!localStorage.getItem("customer")) {
                toast.info("Pls login before add product to your cart")
            }

        }).addCase(getUserWishlist.fulfilled, (state, action) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
            state.wishlist = action.payload;
            state.message = "Get user wishlist";

        }).addCase(getUserWishlist.rejected, (state, action) => {
            state.isError = true;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = action.error;
        }).addCase(getUserCart.pending, (state) => {
            state.isLoading = true;
            state.message = "loading";

        }).addCase(getUserCart.fulfilled, (state, action) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
            state.userCart = action.payload;
            state.message = "Get user cart";

        }).addCase(getUserCart.rejected, (state, action) => {
            state.isError = true;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = action.error;
        }).addCase(deleteProductCart.pending, (state) => {
            state.isLoading = true;
            state.message = "loading";

        }).addCase(deleteProductCart.fulfilled, (state, action) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
            state.userCart = action.payload;
            state.message = "Delete product cart user";
            if (state.isSuccess) {
                toast.success("Successfully, check your cart!!");
            }

        }).addCase(deleteProductCart.rejected, (state, action) => {
            state.isError = true;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = action.error;
            if (state.isError) {
                toast.error("Somwthing wrong, try again!!");
            }
        }).addCase(updateProductCart.pending, (state) => {
            state.isLoading = true;
            state.message = "loading";

        }).addCase(updateProductCart.fulfilled, (state, action) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
            state.userCart = action.payload;
            state.message = "Delete product cart user";
            if (state.isSuccess) {
                toast.success("Successfully, check your cart!!");
            }

        }).addCase(updateProductCart.rejected, (state, action) => {
            state.isError = true;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = action.error;
            if (state.isError) {
                toast.error("Somwthing wrong, try again!!");
            }
        }).addCase(addtoCart.pending, (state) => {
            state.isLoading = true;
            if (!localStorage.getItem("customer")) {
                toast.info("Pls login before add product to your cart")
            }

        }).addCase(addtoCart.fulfilled, (state, action) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
            state.userCart = action.payload;
            state.message = "Get singleproduct";
            if (state.isSuccess) {
                toast.success("Success, check your cart!!")
            }

        }).addCase(addtoCart.rejected, (state, action) => {
            state.isError = true;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = action.error;
            if (state.isError) {
                toast.error("Failed, try again!!")
            }

        }).addCase(sendTokenFogotPassword.pending, (state) => {
            state.isLoading = true;

        }).addCase(sendTokenFogotPassword.fulfilled, (state, action) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
            state.message = "Send token to user email";
            if (state.isSuccess) {
                toast.success("Success, check your email for reset password!!")
            }

        }).addCase(sendTokenFogotPassword.rejected, (state, action) => {
            state.isError = true;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = action.error.message;
            if (state.isError) {
                toast.error(state.message +".Try again!")
            }

        }).addCase(resetPassword.pending, (state) => {
            state.isLoading = true;

        }).addCase(resetPassword.fulfilled, (state, action) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
            state.message = "Send token to user email";
            if (state.isSuccess) {
                toast.success("Reset your password successfully!!")
            }

        }).addCase(resetPassword.rejected, (state, action) => {
            state.isError = true;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = action.error.message;
            if (state.isError) {
                toast.error(state.message +".Try again!")
            }

        }).addCase(createOrderUser.pending, (state) => {
            state.isLoading = true;

        }).addCase(createOrderUser.fulfilled, (state, action) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
            state.message = "Create order ";
            if (state.isSuccess) {
                toast.success("Create your order successfully!!")
            }

        }).addCase(createOrderUser.rejected, (state, action) => {
            state.isError = true;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = action.error.message;
            if (state.isError) {
                toast.error(state.message +".Try again!")
            }

        })
    }
});

export default authSlice.reducer;