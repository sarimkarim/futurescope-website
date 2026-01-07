import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
    name: "category",
    initialState: {
        categories: [],
        loading: false
    },
    reducers: {
        setCategories: (state, action) => {
            state.categories = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        addCategory: (state, action) => {
            state.categories.push(action.payload);
        },
        updateCategory: (state, action) => {
            const index = state.categories.findIndex(cat => cat._id === action.payload._id);
            if (index !== -1) {
                state.categories[index] = action.payload;
            }
        },
        removeCategory: (state, action) => {
            state.categories = state.categories.filter(cat => cat._id !== action.payload);
        }
    }
});

export const {
    setCategories,
    setLoading,
    addCategory,
    updateCategory,
    removeCategory
} = categorySlice.actions;

export default categorySlice.reducer;







