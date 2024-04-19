import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMenuItems } from './menuItemsAPI';

export const fetchMenuItems = createAsyncThunk(
    'menuItems/fetchMenuItems',
    async () => {
        const response = await getMenuItems();
        return response.data;
    }
);

export const menuItemsSlice = createSlice({
    name: 'menuItems',
    initialState: {
        items: [],
        status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMenuItems.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMenuItems.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchMenuItems.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export default menuItemsSlice.reducer;
