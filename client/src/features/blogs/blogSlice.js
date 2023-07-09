import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { blogService } from "./blogService";
import { toast } from "react-toastify";



export const getAllBlog = createAsyncThunk("blog/Allblog", async (thunkAPI) => {
    try {
        return await blogService.getBlogs();
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
});

export const getBlog = createAsyncThunk("blog/SingleBlog", async (id,thunkAPI) => {
    try {
        return await blogService.getBlog(id);
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
});

const blogState = {
    blog: "",
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const blogSlice = createSlice({
    name: "Blog",
    initialState: blogState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllBlog.pending, (state) => {
            state.isLoading = true;
        }).addCase(getAllBlog.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.blog = action.payload;
        }).addCase(getAllBlog.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error;
        }).addCase(getBlog.pending, (state) => {
            state.isLoading = true;
        }).addCase(getBlog.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.SingleBlog = action.payload;
        }).addCase(getBlog.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.error;
        })
    }
});

export default blogSlice.reducer;