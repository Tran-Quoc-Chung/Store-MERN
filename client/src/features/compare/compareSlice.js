import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { compareService } from "./compareService";

const compareState = {
  compare: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
  detailProduct: [],
};

export const getProductCompare = createAsyncThunk(
    "compare/getProductCompare",
    async (_, { getState }) => {
      const { compare } = getState().compare;
      const productPromises = compare.map((productId) =>
        compareService.getProductCompare(productId)
      );
      const detailProducts = await Promise.all(productPromises);
      return detailProducts;
    }
);
  
export const deleteFromCompare = (productId) => (state) => {
    const index = state?.compare?.indexOf(productId);
    if (index !== -1) {
      state?.compare?.splice(index, 1);
      toast.success("Product removed from compare");
    } else {
      toast.info("Product not found in compare");
    }
  };
  

export const compareSlice = createSlice({
  name: "compare",
  initialState: compareState,
  reducers: {
    addCompare: (state, action) => {
      if (state.compare?.length < 4) {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        for (let i = 0; i < 4; i++) {
          if (state.compare[i] === action.payload) {
            toast.info("This product already exists in compare!!");
            return;
          }
        }
        state.compare = [...state.compare, action.payload];

        toast.success("Add to compare successfully!!");
      } else {
        state.isError = true;
        toast.error("Compare list is full.");
      }
      },
  },
  extraReducers: (builder) => {
    builder.addCase(getProductCompare.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getProductCompare.fulfilled, (state, action) => {
      state.isLoading = false;
      state.detailProduct = action.payload;
    });
    builder.addCase(getProductCompare.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.error.message;
    });
  },
});

export const { addCompare } = compareSlice.actions;



export default compareSlice.reducer;
