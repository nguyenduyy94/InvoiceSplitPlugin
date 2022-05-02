import { createSlice } from '@reduxjs/toolkit'

export const workspaceSlice = createSlice({
    name: "workspace",
    initialState: {
        currentURL: null,
    },
    reducers: {
        setCurrentURL: (state, action) => {
            state = {...state, currentURL: action.payload}
        }
    }
});

export default workspaceSlice.reducer