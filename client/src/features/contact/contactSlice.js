import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { contactService } from "./contactService";
import { toast } from "react-toastify";

const contactState = {
    contact: "",
    isError: false,
    isLoading: false,
    isSuccess: false,
    message:"",
}

export const createQuery = createAsyncThunk("contact/post", async (contactData,thunkAPI) => {
    try {
        return await contactService.postQuery(contactData)
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
})
export const contactSlice = createSlice({
    name: "contact",
    initialState: contactState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createQuery.pending, (state) => {
            state.isLoading = true;
        }).addCase(createQuery.fulfilled, (state,action) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
            state.contact = action.payload;
            if (state.isSuccess) {
                toast.success("Send your response successfully!!")
            }

        }).addCase(createQuery.rejected, (state,action) => {
            state.isError = true;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = action.error;

            if (state.isError) {
                toast.error("Send your response failed. Try again!!")
            }

        })
    }
})



export default contactSlice.reducer;